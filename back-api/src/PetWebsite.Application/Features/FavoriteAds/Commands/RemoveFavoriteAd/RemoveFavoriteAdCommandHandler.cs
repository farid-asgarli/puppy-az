using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Constants;

namespace PetWebsite.Application.Features.FavoriteAds.Commands.RemoveFavoriteAd;

public class RemoveFavoriteAdCommandHandler(
	IApplicationDbContext dbContext,
	IStringLocalizer localizer,
	ICurrentUserService currentUserService
) : BaseHandler(localizer), ICommandHandler<RemoveFavoriteAdCommand, Result>
{
	public async Task<Result> Handle(RemoveFavoriteAdCommand request, CancellationToken ct)
	{
		var userId = currentUserService.UserId;
		if (userId == null)
			return Result.Failure(L(LocalizationKeys.Error.Unauthorized), 401);

		// Find the favorite ad
		var favoriteAd = await dbContext.FavoriteAds.FirstOrDefaultAsync(f => f.UserId == userId && f.PetAdId == request.PetAdId, ct);

		if (favoriteAd == null)
			return Result.Failure(L(LocalizationKeys.FavoriteAd.NotFound), 404);

		// Remove from favorites
		dbContext.FavoriteAds.Remove(favoriteAd);
		await dbContext.SaveChangesAsync(ct);

		return Result.Success();
	}
}
