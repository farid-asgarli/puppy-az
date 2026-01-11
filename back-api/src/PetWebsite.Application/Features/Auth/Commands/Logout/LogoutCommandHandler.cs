using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Constants;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Application.Features.Auth.Commands.Logout;

public class LogoutCommandHandler(
	UserManager<User> userManager,
	ICurrentUserService currentUserService,
	ITokenBlacklistService tokenBlacklistService,
	IStringLocalizer localizer
) : BaseHandler(localizer), ICommandHandler<LogoutCommand, Result<bool>>
{
	public async Task<Result<bool>> Handle(LogoutCommand request, CancellationToken cancellationToken)
	{
		try
		{
			var userId = currentUserService.UserId;
			if (!userId.HasValue)
			{
				return Result<bool>.Failure(L(LocalizationKeys.Error.Unauthorized), 401);
			}

			var user = await userManager.FindByIdAsync(userId.Value.ToString());
			if (user == null)
			{
				return Result<bool>.Failure(L(LocalizationKeys.User.NotFound), 404);
			}

			// Get token information from current user service
			var tokenId = currentUserService.GetTokenId();
			var tokenExpiration = currentUserService.GetTokenExpiration();

			if (tokenId != null && tokenExpiration.HasValue)
			{
				// Blacklist the current access token
				await tokenBlacklistService.BlacklistTokenAsync(
					tokenId,
					userId.Value,
					"User",
					tokenExpiration.Value,
					"Logout",
					cancellationToken
				);
			}

			// Invalidate refresh token
			user.RefreshToken = null;
			user.RefreshTokenExpiryTime = null;
			await userManager.UpdateAsync(user);

			return Result<bool>.Success(true);
		}
		catch (Exception ex)
		{
			return Result<bool>.Failure($"Logout failed: {ex.Message}", 500);
		}
	}
}
