using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Options;
using PetWebsite.Application.Common.Configuration;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Constants;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Application.Features.Auth.Commands.Register;

public class RegisterCommandHandler(
	UserManager<User> userManager,
	IJwtTokenService jwtTokenService,
	IOptions<JwtSettings> jwtSettings,
	ISmsVerificationService smsVerificationService,
	IStringLocalizer localizer
) : BaseHandler(localizer), ICommandHandler<RegisterCommand, Result<AuthenticationResponse>>
{
	private readonly UserManager<User> _userManager = userManager;
	private readonly IJwtTokenService _jwtTokenService = jwtTokenService;
	private readonly JwtSettings _jwtSettings = jwtSettings.Value;
	private readonly ISmsVerificationService _smsVerificationService = smsVerificationService;

	public async Task<Result<AuthenticationResponse>> Handle(RegisterCommand request, CancellationToken cancellationToken)
	{
		try
		{
			// Verify SMS verification code FIRST
			var verificationResult = await _smsVerificationService.VerifyCodeAsync(
				request.PhoneNumber,
				request.VerificationCode,
				"Registration",
				markAsUsed: true,
				cancellationToken
			);

			if (!verificationResult.IsSuccess)
			{
				return Result<AuthenticationResponse>.Failure(verificationResult.Error!, verificationResult.StatusCode);
			}

			// Check if user already exists
			var existingUser = await _userManager.FindByEmailAsync(request.Email);
			if (existingUser != null)
			{
				return Result<AuthenticationResponse>.Failure(L(LocalizationKeys.Auth.UserAlreadyExists), 400);
			}

			// Create new user
			var user = new User
			{
				UserName = request.Email,
				Email = request.Email,
				FirstName = request.FirstName,
				LastName = request.LastName,
				PhoneNumber = request.PhoneNumber,
				PhoneNumberConfirmed = true, // Already verified via SMS
				CreatedAt = DateTime.UtcNow,
				IsActive = true,
				EmailConfirmed = true, // Set to false in production with email verification
			};

			var result = await _userManager.CreateAsync(user, request.Password);

			if (!result.Succeeded)
			{
				var errors = string.Join(", ", result.Errors.Select(e => e.Description));
				return Result<AuthenticationResponse>.Failure($"{L(LocalizationKeys.Auth.RegisterFailed)}: {errors}", 400);
			}

			// Clean up old verification codes
			await _smsVerificationService.CleanupOldCodesAsync(request.PhoneNumber, null, cancellationToken);

			// Generate tokens (regular users don't have roles in your architecture)
			var accessToken = _jwtTokenService.GenerateAccessToken(user, []);
			var refreshToken = _jwtTokenService.GenerateRefreshToken();

			// Update refresh token
			user.RefreshToken = refreshToken;
			user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenExpirationDays);
			user.LastLoginAt = DateTime.UtcNow;
			await _userManager.UpdateAsync(user);

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
			};

			return Result<AuthenticationResponse>.Success(response);
		}
		catch (Exception ex)
		{
			return Result<AuthenticationResponse>.Failure($"{L(LocalizationKeys.Auth.RegisterFailed)}: {ex.Message}", 500);
		}
	}
}
