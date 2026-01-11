using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Options;
using PetWebsite.Application.Common.Configuration;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Constants;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Application.Features.Admin.Auth.Commands.RefreshToken;

public class RefreshTokenCommandHandler(
	UserManager<AdminUser> userManager,
	IJwtTokenService jwtTokenService,
	IOptions<JwtSettings> jwtSettings,
	IStringLocalizer localizer
) : BaseHandler(localizer), ICommandHandler<RefreshTokenCommand, Result<AuthenticationResponse>>
{
	private readonly UserManager<AdminUser> _userManager = userManager;
	private readonly IJwtTokenService _jwtTokenService = jwtTokenService;
	private readonly JwtSettings _jwtSettings = jwtSettings.Value;

	public async Task<Result<AuthenticationResponse>> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
	{
		try
		{
			// Find user by refresh token
			var user = _userManager.Users.FirstOrDefault(u => u.RefreshToken == request.RefreshToken);

			if (user == null)
			{
				return Result<AuthenticationResponse>.Failure(L(LocalizationKeys.Auth.InvalidRefreshToken), 401);
			}

			if (!user.RefreshTokenExpiryTime.HasValue || user.RefreshTokenExpiryTime.Value <= DateTime.UtcNow)
			{
				return Result<AuthenticationResponse>.Failure(L(LocalizationKeys.Auth.InvalidRefreshToken), 401);
			}

			if (!user.IsActive)
			{
				return Result<AuthenticationResponse>.Failure(L(LocalizationKeys.Auth.AccountInactive), 403);
			}

			// Generate new tokens
			var roles = await _userManager.GetRolesAsync(user);
			var accessToken = _jwtTokenService.GenerateAccessToken(user, roles);
			var refreshToken = _jwtTokenService.GenerateRefreshToken();

			// Update refresh token
			user.RefreshToken = refreshToken;
			user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenExpirationDays);
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
			return Result<AuthenticationResponse>.Failure($"Token refresh failed: {ex.Message}", 500);
		}
	}
}
