using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Application.Extensions;
using PetWebsite.Domain.Constants;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Application.Features.Admin.Districts.Commands.SoftDelete;

public class SoftDeleteDistrictCommandHandler(IApplicationDbContext dbContext, IStringLocalizer localizer)
	: BaseHandler(localizer),
		ICommandHandler<SoftDeleteDistrictCommand, Result>
{
	public async Task<Result> Handle(SoftDeleteDistrictCommand request, CancellationToken ct)
	{
		// Check if district has pet ads
		var hasPetAds = await dbContext.PetAds.AnyAsync(pa => pa.DistrictId == request.Id, ct);

		if (hasPetAds)
			return Result.Failure(L(LocalizationKeys.District.CannotDeleteWithPetAds), 400);

		var success = await dbContext.Districts.SoftDeleteByIdAsync<District, int>(request.Id, request.DeletedBy, ct);

		if (!success)
			return Result.Failure(L(LocalizationKeys.District.NotFound), 404);

		await dbContext.SaveChangesAsync(ct);
		return Result.Success();
	}
}
