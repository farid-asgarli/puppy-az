using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Options;
using PetWebsite.Application.Common.Configuration;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Constants;
using PetWebsite.Domain.Entities;
using PetWebsite.Domain.Helpers;

namespace PetWebsite.Application.Features.Auth.Commands.LoginWithMobile;

public class LoginWithMobileCommandHandler(
	UserManager<User> userManager,
	IJwtTokenService jwtTokenService,
	IOptions<JwtSettings> jwtSettings,
	ISmsVerificationService smsVerificationService,
	IStringLocalizer localizer
) : BaseHandler(localizer), ICommandHandler<LoginWithMobileCommand, Result<AuthenticationResponse>>
{
	private readonly UserManager<User> _userManager = userManager;
	private readonly IJwtTokenService _jwtTokenService = jwtTokenService;
	private readonly JwtSettings _jwtSettings = jwtSettings.Value;
	private readonly ISmsVerificationService _smsVerificationService = smsVerificationService;

	public async Task<Result<AuthenticationResponse>> Handle(LoginWithMobileCommand request, CancellationToken cancellationToken)
	{
		try
		{
			// Verify SMS verification code
			var verificationResult = await _smsVerificationService.VerifyCodeAsync(
				request.PhoneNumber,
				request.VerificationCode,
				"Login",
				markAsUsed: true,
				cancellationToken
			);

			if (!verificationResult.IsSuccess)
			{
				return Result<AuthenticationResponse>.Failure(verificationResult.Error!, verificationResult.StatusCode);
			}

			// Normalize the phone number and match against all equivalent formats so that
			// accounts created by an admin (or before normalization) are still found.
			var phoneNumber = PhoneNumberHelper.Normalize(request.PhoneNumber)!;
			var lookupCandidates = PhoneNumberHelper.GetLookupCandidates(request.PhoneNumber);

			// Find user by phone number
			var user = await _userManager.Users.FirstOrDefaultAsync(
				u => u.PhoneNumber != null && lookupCandidates.Contains(u.PhoneNumber),
				cancellationToken
			);

			// First-time SMS login with no existing account: create a passwordless
			// account on the fly so the user can sign in without interruption.
			if (user == null)
			{
				user = new User
				{
					PhoneNumber = phoneNumber,
					PhoneNumberConfirmed = true, // Verified via SMS
					UserName = phoneNumber,
					Email = $"{Guid.NewGuid()}@placeholder.local", // Placeholder email
					EmailConfirmed = false,
					FirstName = "",
					LastName = "",
					IsActive = true,
					IsCreatedByAdmin = false,
					CreatedAt = DateTime.UtcNow,
				};

				var createResult = await _userManager.CreateAsync(user);
				if (!createResult.Succeeded)
				{
					var errors = string.Join(", ", createResult.Errors.Select(e => e.Description));
					return Result<AuthenticationResponse>.Failure($"{L(LocalizationKeys.Auth.LoginFailed)}: {errors}", 400);
				}
			}

			if (!user.IsActive)
			{
				return Result<AuthenticationResponse>.Failure(L(LocalizationKeys.Auth.AccountInactive), 403);
			}

			// Treat any account that has never logged in before as a first-time login.
			// This covers both freshly auto-created accounts and admin-created accounts.
			var isNewUser = user.LastLoginAt is null;

			// Regular users don't have roles in your architecture
			var accessToken = _jwtTokenService.GenerateAccessToken(user, []);
			var refreshToken = _jwtTokenService.GenerateRefreshToken();

			// Update refresh token
			user.RefreshToken = refreshToken;
			user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenExpirationDays);
			user.LastLoginAt = DateTime.UtcNow;
			await _userManager.UpdateAsync(user);

			// Clean up old verification codes
			await _smsVerificationService.CleanupOldCodesAsync(request.PhoneNumber, null, cancellationToken);

			var response = new AuthenticationResponse
			{
				UserId = user.Id,
				Email = user.Email!,
				FirstName = user.FirstName,
				LastName = user.LastName,
				Roles = [], // Regular users don't have roles
				AccessToken = accessToken,
				RefreshToken = refreshToken,
				ExpiresAt = DateTime.UtcNow.AddMinutes(_jwtSettings.AccessTokenExpirationMinutes),
				IsNewUser = isNewUser,
			};

			return Result<AuthenticationResponse>.Success(response);
		}
		catch (Exception ex)
		{
			return Result<AuthenticationResponse>.Failure($"{L(LocalizationKeys.Auth.LoginFailed)}: {ex.Message}", 500);
		}
	}
}
