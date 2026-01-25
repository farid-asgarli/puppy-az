using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Application.Extensions;
using PetWebsite.Domain.Constants;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Application.Features.PetAds.Commands.RecordPetAdView;

public class RecordPetAdViewCommandHandler(
	IApplicationDbContext dbContext,
	ICurrentUserService currentUserService,
	IStringLocalizer localizer
) : BaseHandler(localizer), ICommandHandler<RecordPetAdViewCommand, Result>
{
	public async Task<Result> Handle(RecordPetAdViewCommand request, CancellationToken ct)
	{
		// Get current user ID
		var userId = currentUserService.UserId;
		if (userId is null)
			return Result.Failure(L(LocalizationKeys.Error.Unauthorized), 401);

		// Verify the pet ad exists and is not deleted
		var petAdExists = await dbContext.PetAds.WhereNotDeleted<PetAd, int>().AnyAsync(p => p.Id == request.PetAdId, ct);

		if (!petAdExists)
			return Result.Failure(L(LocalizationKeys.PetAd.NotFound), 404);

		// Check if the user has already viewed this ad recently (within the last hour)
		// to avoid creating duplicate records for the same viewing session
		var oneHourAgo = DateTime.UtcNow.AddHours(-1);
		var recentView = await dbContext.PetAdViews.AnyAsync(
			v => v.UserId == userId.Value && v.PetAdId == request.PetAdId && v.ViewedAt >= oneHourAgo,
			ct
		);

		if (recentView)
		{
			// Already recorded a view in the last hour, no need to create another record
			return Result.Success();
		}

		// Create a new view record (for recently viewed tracking only, not for view count)
		var petAdView = new PetAdView
		{
			UserId = userId.Value,
			PetAdId = request.PetAdId,
			ViewedAt = DateTime.UtcNow,
		};

		dbContext.PetAdViews.Add(petAdView);
		await dbContext.SaveChangesAsync(ct);

		return Result.Success();
	}
}
