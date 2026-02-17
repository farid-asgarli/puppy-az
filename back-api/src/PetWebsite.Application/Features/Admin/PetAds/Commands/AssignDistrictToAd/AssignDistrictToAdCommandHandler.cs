using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Application.Extensions;
using PetWebsite.Domain.Constants;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Application.Features.Admin.PetAds.Commands.AssignDistrictToAd;

public class AssignDistrictToAdCommandHandler(
	IApplicationDbContext dbContext,
	IStringLocalizer localizer)
	: BaseHandler(localizer),
		ICommandHandler<AssignDistrictToAdCommand, Result>
{
	public async Task<Result> Handle(AssignDistrictToAdCommand request, CancellationToken ct)
	{
		var petAd = await dbContext.PetAds
			.FirstOrDefaultAsync(p => p.Id == request.PetAdId && !p.IsDeleted, ct);

		if (petAd is null)
			return Result.Failure(L(LocalizationKeys.PetAd.NotFound), 404);

		var district = await dbContext.Districts
			.Where(d => d.Id == request.DistrictId && d.IsActive && !d.IsDeleted)
			.FirstOrDefaultAsync(ct);

		if (district is null)
			return Result.Failure(L(LocalizationKeys.PetAd.DistrictNotFound), 404);

		petAd.DistrictId = district.Id;
		petAd.CustomDistrictName = null; // Clear the suggestion since district is now assigned
		petAd.UpdatedAt = DateTime.UtcNow;

		await dbContext.SaveChangesAsync(ct);

		return Result.Success();
	}
}
