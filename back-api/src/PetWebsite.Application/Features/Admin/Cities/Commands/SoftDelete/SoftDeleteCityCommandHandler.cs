using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Application.Extensions;
using PetWebsite.Domain.Constants;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Application.Features.Admin.Cities.Commands.SoftDelete;

public class SoftDeleteCityCommandHandler(IApplicationDbContext dbContext, IStringLocalizer localizer)
	: BaseHandler(localizer),
		ICommandHandler<SoftDeleteCityCommand, Result>
{
	public async Task<Result> Handle(SoftDeleteCityCommand request, CancellationToken ct)
	{
		// Check if city has pet ads
		var hasPetAds = await dbContext.PetAds.AnyAsync(pa => pa.CityId == request.Id, ct);

		if (hasPetAds)
			return Result.Failure(L(LocalizationKeys.City.CannotDeleteWithPetAds), 400);

		var success = await dbContext.Cities.SoftDeleteByIdAsync<City, int>(request.Id, request.DeletedBy, ct);

		if (!success)
			return Result.Failure(L(LocalizationKeys.City.NotFound), 404);

		return Result.Success();
	}
}
