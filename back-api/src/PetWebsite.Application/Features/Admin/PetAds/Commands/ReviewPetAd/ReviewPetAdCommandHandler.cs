using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Constants;
using PetWebsite.Domain.Enums;

namespace PetWebsite.Application.Features.Admin.PetAds.Commands.ReviewPetAd;

public class ReviewPetAdCommandHandler(IApplicationDbContext dbContext, IStringLocalizer localizer)
	: BaseHandler(localizer),
		ICommandHandler<ReviewPetAdCommand, Result>
{
	public async Task<Result> Handle(ReviewPetAdCommand request, CancellationToken ct)
	{
		var petAd = await dbContext.PetAds.FirstOrDefaultAsync(p => p.Id == request.Id, ct);

		if (petAd == null)
			return Result.Failure(L(LocalizationKeys.PetAd.NotFound), 404);

		// Validate status transition
		if (request.Status != PetAdStatus.Published && request.Status != PetAdStatus.Rejected)
			return Result.Failure(L(LocalizationKeys.PetAd.InvalidStatusTransition), 400);

		// If rejecting, require a rejection reason
		if (request.Status == PetAdStatus.Rejected && string.IsNullOrWhiteSpace(request.RejectionReason))
			return Result.Failure(L(LocalizationKeys.PetAd.RejectionReasonRequired), 400);

		// Check if ad is in a reviewable state (Pending)
		if (petAd.Status != PetAdStatus.Pending)
			return Result.Failure(L(LocalizationKeys.PetAd.CannotReviewNonPendingAd), 400);

		petAd.Status = request.Status;
		petAd.RejectionReason = request.Status == PetAdStatus.Rejected ? request.RejectionReason : null;

		if (request.Status == PetAdStatus.Published)
		{
			petAd.PublishedAt = DateTime.UtcNow;
		}

		await dbContext.SaveChangesAsync(ct);

		return Result.Success();
	}
}
