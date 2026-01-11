using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Constants;
using PetWebsite.Domain.Enums;

namespace PetWebsite.Application.Features.PetAds.Commands.ClosePetAd;

public class ClosePetAdCommandHandler(IApplicationDbContext dbContext, IStringLocalizer localizer, ICurrentUserService currentUserService)
	: BaseHandler(localizer),
		ICommandHandler<ClosePetAdCommand, Result>
{
	public async Task<Result> Handle(ClosePetAdCommand request, CancellationToken ct)
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

		// Check if ad can be closed (must be Published)
		if (petAd.Status != PetAdStatus.Published)
			return Result.Failure(L(LocalizationKeys.PetAd.CannotCloseNonPublishedAd), 400);

		petAd.Status = PetAdStatus.Closed;
		petAd.IsAvailable = false;

		await dbContext.SaveChangesAsync(ct);

		return Result.Success();
	}
}
