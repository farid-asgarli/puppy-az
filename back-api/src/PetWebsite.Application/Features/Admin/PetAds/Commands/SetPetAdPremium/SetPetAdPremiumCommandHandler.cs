using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Constants;

namespace PetWebsite.Application.Features.Admin.PetAds.Commands.SetPetAdPremium;

public class SetPetAdPremiumCommandHandler(IApplicationDbContext dbContext, IStringLocalizer localizer)
	: BaseHandler(localizer),
		ICommandHandler<SetPetAdPremiumCommand, Result>
{
	public async Task<Result> Handle(SetPetAdPremiumCommand request, CancellationToken ct)
	{
		var petAd = await dbContext.PetAds.FirstOrDefaultAsync(p => p.Id == request.Id, ct);

		if (petAd == null)
			return Result.Failure(L(LocalizationKeys.PetAd.NotFound), 404);

		if (petAd.IsDeleted)
			return Result.Failure(L(LocalizationKeys.PetAd.NotFound), 404);

		// If setting to premium
		if (request.IsPremium)
		{
			if (!request.DurationInDays.HasValue || request.DurationInDays.Value <= 0)
				return Result.Failure("Duration in days is required and must be positive when setting premium status.", 400);

			var now = DateTime.UtcNow;
			petAd.IsPremium = true;
			petAd.PremiumActivatedAt = now;
			petAd.PremiumExpiresAt = now.AddDays(request.DurationInDays.Value);
		}
		// If removing premium
		else
		{
			petAd.IsPremium = false;
			petAd.PremiumActivatedAt = null;
			petAd.PremiumExpiresAt = null;
		}

		await dbContext.SaveChangesAsync(ct);

		return Result.Success();
	}
}
