using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Options;
using PetWebsite.Application.Common.Configuration;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Constants;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Application.Features.Admin.Auth.Commands.Login;

public class LoginCommandHandler(
	UserManager<AdminUser> userManager,
	IJwtTokenService jwtTokenService,
	IOptions<JwtSettings> jwtSettings,
	IStringLocalizer localizer
) : BaseHandler(localizer), ICommandHandler<LoginCommand, Result<AuthenticationResponse>>
{
	private readonly UserManager<AdminUser> _userManager = userManager;
	private readonly IJwtTokenService _jwtTokenService = jwtTokenService;
	private readonly JwtSettings _jwtSettings = jwtSettings.Value;

	public async Task<Result<AuthenticationResponse>> Handle(LoginCommand request, CancellationToken cancellationToken)
	{
		try
		{
			var user = await _userManager.FindByEmailAsync(request.Email);
			if (user == null)
			{
				return Result<AuthenticationResponse>.Failure(L(LocalizationKeys.Auth.InvalidCredentials), 401);
			}

			if (!user.IsActive)
			{
				return Result<AuthenticationResponse>.Failure(L(LocalizationKeys.Auth.AccountInactive), 403);
			}

			var isPasswordValid = await _userManager.CheckPasswordAsync(user, request.Password);
			if (!isPasswordValid)
			{
				return Result<AuthenticationResponse>.Failure(L(LocalizationKeys.Auth.InvalidCredentials), 401);
			}

			var roles = await _userManager.GetRolesAsync(user);
			var accessToken = _jwtTokenService.GenerateAccessToken(user, roles);
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
				Roles = [.. roles],
				AccessToken = accessToken,
				RefreshToken = refreshToken,
				ExpiresAt = DateTime.UtcNow.AddMinutes(_jwtSettings.AccessTokenExpirationMinutes),
			};

			return Result<AuthenticationResponse>.Success(response);
		}
		catch (Exception ex)
		{
			return Result<AuthenticationResponse>.Failure($"Login failed: {ex.Message}", 500);
		}
	}
}
