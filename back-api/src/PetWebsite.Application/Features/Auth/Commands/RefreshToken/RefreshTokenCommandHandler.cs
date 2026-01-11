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

namespace PetWebsite.Application.Features.Auth.Commands.RefreshToken;

public class RefreshTokenCommandHandler(
	UserManager<User> userManager,
	IJwtTokenService jwtTokenService,
	IOptions<JwtSettings> jwtSettings,
	IStringLocalizer localizer
) : BaseHandler(localizer), ICommandHandler<RefreshTokenCommand, Result<AuthenticationResponse>>
{
	private readonly UserManager<User> _userManager = userManager;
	private readonly IJwtTokenService _jwtTokenService = jwtTokenService;
	private readonly JwtSettings _jwtSettings = jwtSettings.Value;

	public async Task<Result<AuthenticationResponse>> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
	{
		try
		{
			var user = await _userManager.Users.FirstOrDefaultAsync(u => u.RefreshToken == request.RefreshToken, cancellationToken);

			if (user == null)
			{
				return Result<AuthenticationResponse>.Failure(L(LocalizationKeys.Auth.InvalidRefreshToken), 401);
			}

			if (user.RefreshTokenExpiryTime <= DateTime.UtcNow)
			{
				return Result<AuthenticationResponse>.Failure(L(LocalizationKeys.Auth.InvalidRefreshToken), 401);
			}

			if (!user.IsActive)
			{
				return Result<AuthenticationResponse>.Failure(L(LocalizationKeys.Auth.AccountInactive), 403);
			}

			// Generate new tokens (regular users don't have roles)
			var accessToken = _jwtTokenService.GenerateAccessToken(user, []);
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
				Roles = [], // Regular users don't have roles
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
