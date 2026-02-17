using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Constants;

namespace PetWebsite.Application.Features.Admin.PetAds.Commands.SetPetAdVip;

public class SetPetAdVipCommandHandler(IApplicationDbContext dbContext, IStringLocalizer localizer)
	: BaseHandler(localizer),
		ICommandHandler<SetPetAdVipCommand, Result>
{
	public async Task<Result> Handle(SetPetAdVipCommand request, CancellationToken ct)
	{
		var petAd = await dbContext.PetAds.FirstOrDefaultAsync(p => p.Id == request.Id, ct);

		if (petAd == null)
			return Result.Failure(L(LocalizationKeys.PetAd.NotFound), 404);

		if (petAd.IsDeleted)
			return Result.Failure(L(LocalizationKeys.PetAd.NotFound), 404);

		// If setting to VIP
		if (request.IsVip)
		{
			if (!request.DurationInDays.HasValue || request.DurationInDays.Value <= 0)
				return Result.Failure("Duration in days is required and must be positive when setting VIP status.", 400);

			var now = DateTime.UtcNow;
			petAd.IsVip = true;
			petAd.VipActivatedAt = now;
			petAd.VipExpiresAt = now.AddDays(request.DurationInDays.Value);
		}
		// If removing VIP
		else
		{
			petAd.IsVip = false;
			petAd.VipActivatedAt = null;
			petAd.VipExpiresAt = null;
		}

		await dbContext.SaveChangesAsync(ct);

		return Result.Success();
	}
}
