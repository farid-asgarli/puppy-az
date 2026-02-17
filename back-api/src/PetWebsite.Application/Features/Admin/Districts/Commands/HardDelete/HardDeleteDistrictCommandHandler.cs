using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Constants;

namespace PetWebsite.Application.Features.Admin.Districts.Commands.HardDelete;

public class HardDeleteDistrictCommandHandler(IApplicationDbContext dbContext, IStringLocalizer localizer)
	: BaseHandler(localizer),
		ICommandHandler<HardDeleteDistrictCommand, Result>
{
	public async Task<Result> Handle(HardDeleteDistrictCommand request, CancellationToken ct)
	{
		var district = await dbContext.Districts
			.Include(d => d.PetAds)
			.FirstOrDefaultAsync(d => d.Id == request.Id, ct);

		if (district == null)
			return Result.Failure(L(LocalizationKeys.District.NotFound), 404);

		// Check if district has any pet ads
		if (district.PetAds.Count != 0)
			return Result.Failure(L(LocalizationKeys.District.CannotDeleteWithPetAds), 400);

		dbContext.Districts.Remove(district);
		await dbContext.SaveChangesAsync(ct);

		return Result.Success();
	}
}
