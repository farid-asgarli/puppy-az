using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Constants;
using PetWebsite.Domain.Enums;

namespace PetWebsite.Application.Features.Admin.PetAds.Commands.SetPetAdStatus;

public class SetPetAdStatusCommandHandler(
	IApplicationDbContext dbContext,
	IStringLocalizer localizer,
	ILogger<SetPetAdStatusCommandHandler> logger)
	: BaseHandler(localizer),
		ICommandHandler<SetPetAdStatusCommand, Result>
{
	public async Task<Result> Handle(SetPetAdStatusCommand request, CancellationToken ct)
	{
		logger.LogInformation("[SetPetAdStatus] Changing ad Id={Id} to Status={Status}",
			request.Id, request.Status);

		var petAd = await dbContext.PetAds.FirstOrDefaultAsync(p => p.Id == request.Id, ct);

		if (petAd == null)
		{
			logger.LogWarning("[SetPetAdStatus] Ad Id={Id} not found", request.Id);
			return Result.Failure(L(LocalizationKeys.PetAd.NotFound), 404);
		}

		var previousStatus = petAd.Status;
		petAd.Status = request.Status;
		logger.LogInformation("[SetPetAdStatus] Ad Id={Id} status transition: {From} -> {To}",
			request.Id, previousStatus, request.Status);

		// Update related fields based on new status
		switch (request.Status)
		{
			case PetAdStatus.Published:
				petAd.IsAvailable = true;
				// Always set new 30-day expiration when admin activates an ad
				// This applies when coming from any non-Published status
				if (previousStatus != PetAdStatus.Published)
				{
					petAd.PublishedAt = DateTime.UtcNow;
					petAd.ExpiresAt = DateTime.UtcNow.AddDays(30);
				}
				break;
			
			case PetAdStatus.Expired:
			case PetAdStatus.Closed:
			case PetAdStatus.Rejected:
				petAd.IsAvailable = false;
				break;
			
			case PetAdStatus.Pending:
				petAd.IsAvailable = true;
				petAd.RejectionReason = null;
				break;
		}

		await dbContext.SaveChangesAsync(ct);
		logger.LogInformation("[SetPetAdStatus] Ad Id={Id} successfully updated to Status={Status}, IsAvailable={IsAvailable}, ExpiresAt={ExpiresAt}",
			request.Id, petAd.Status, petAd.IsAvailable, petAd.ExpiresAt);

		return Result.Success();
	}
}
