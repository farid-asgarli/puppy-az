using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Constants;
using PetWebsite.Domain.Enums;

namespace PetWebsite.Application.Features.PetAds.Commands.ReactivatePetAd;

public class ReactivatePetAdCommandHandler(
	IApplicationDbContext dbContext, 
	IStringLocalizer localizer, 
	ICurrentUserService currentUserService)
	: BaseHandler(localizer),
		ICommandHandler<ReactivatePetAdCommand, Result>
{
	public async Task<Result> Handle(ReactivatePetAdCommand request, CancellationToken ct)
	{
		var userId = currentUserService.UserId;
		if (userId == null)
			return Result.Failure(L(LocalizationKeys.Error.Unauthorized), 401);

		var petAd = await dbContext.PetAds.FirstOrDefaultAsync(p => p.Id == request.Id, ct);

		if (petAd == null)
			return Result.Failure(L(LocalizationKeys.PetAd.NotFound), 404);

		// Ensure the user owns this ad
		if (petAd.UserId != userId)
			return Result.Failure(L(LocalizationKeys.Error.Forbidden), 403);

		// Can only reactivate expired or closed ads
		if (petAd.Status != PetAdStatus.Expired && petAd.Status != PetAdStatus.Closed)
			return Result.Failure(L(LocalizationKeys.PetAd.CannotReactivateAd), 400);

		// Set status to Pending for admin review
		petAd.Status = PetAdStatus.Pending;
		petAd.IsAvailable = true;
		petAd.ExpiresAt = null; // Will be set again when admin approves
		petAd.PublishedAt = null; // Reset publish date

		await dbContext.SaveChangesAsync(ct);

		return Result.Success();
	}
}
