using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Constants;
using PetWebsite.Domain.Entities;
using PetWebsite.Domain.Enums;

namespace PetWebsite.Application.Features.FavoriteAds.Commands.AddFavoriteAd;

public class AddFavoriteAdCommandHandler(
	IApplicationDbContext dbContext,
	IStringLocalizer localizer,
	ICurrentUserService currentUserService
) : BaseHandler(localizer), ICommandHandler<AddFavoriteAdCommand, Result>
{
	public async Task<Result> Handle(AddFavoriteAdCommand request, CancellationToken ct)
	{
		var userId = currentUserService.UserId;
		if (userId == null)
			return Result.Failure(L(LocalizationKeys.Error.Unauthorized), 401);

		if (request.PetAdIds == null || request.PetAdIds.Count == 0)
			return Result.Failure("At least one PetAdId is required", 400);

		// Get all valid pet ads (published and not deleted)
		var validPetAdIds = await dbContext
			.PetAds.AsNoTracking()
			.Where(p => request.PetAdIds.Contains(p.Id) && p.Status == PetAdStatus.Published && !p.IsDeleted)
			.Select(p => p.Id)
			.ToListAsync(ct);

		if (validPetAdIds.Count == 0)
			return Result.Failure(L(LocalizationKeys.PetAd.NotFound), 404);

		// Get already favorited ads
		var alreadyFavoritedIds = await dbContext
			.FavoriteAds.AsNoTracking()
			.Where(f => f.UserId == userId && request.PetAdIds.Contains(f.PetAdId))
			.Select(f => f.PetAdId)
			.ToListAsync(ct);

		// Get ads that need to be added (valid ads that are not already favorited)
		var adsToAdd = validPetAdIds.Except(alreadyFavoritedIds).ToList();

		if (adsToAdd.Count == 0)
			return Result.Failure(L(LocalizationKeys.FavoriteAd.AlreadyAdded), 400);

		// Add to favorites
		var favoriteAds = adsToAdd
			.Select(petAdId => new FavoriteAd
			{
				UserId = userId.Value,
				PetAdId = petAdId,
				CreatedAt = DateTime.UtcNow,
			})
			.ToList();

		dbContext.FavoriteAds.AddRange(favoriteAds);
		await dbContext.SaveChangesAsync(ct);

		return Result.Success(201);
	}
}
