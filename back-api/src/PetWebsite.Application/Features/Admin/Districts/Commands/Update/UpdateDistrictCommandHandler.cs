using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Application.Extensions;
using PetWebsite.Domain.Constants;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Application.Features.Admin.Districts.Commands.Update;

public class UpdateDistrictCommandHandler(IApplicationDbContext dbContext, IStringLocalizer localizer)
	: BaseHandler(localizer),
		ICommandHandler<UpdateDistrictCommand, Result>
{
	public async Task<Result> Handle(UpdateDistrictCommand request, CancellationToken ct)
	{
		var district = await dbContext.Districts.FirstOrDefaultAsync(d => d.Id == request.Id, ct);

		if (district == null)
			return Result.Failure(L(LocalizationKeys.District.NotFound), 404);

		// Verify city exists
		var cityExists = await dbContext.Cities
			.WhereNotDeleted<City, int>()
			.AnyAsync(c => c.Id == request.CityId, ct);

		if (!cityExists)
			return Result.Failure(L(LocalizationKeys.City.NotFound), 404);

		// Check if another district with same name already exists in the same city
		var existingDistrict = await dbContext.Districts
			.WhereNotDeleted<District, int>()
			.FirstOrDefaultAsync(
				d => d.Id != request.Id
					&& d.CityId == request.CityId
					&& (d.NameAz == request.NameAz || d.NameEn == request.NameEn || d.NameRu == request.NameRu),
				ct
			);

		if (existingDistrict != null)
			return Result.Failure(L(LocalizationKeys.District.AlreadyExists), 409);

		district.NameAz = request.NameAz;
		district.NameEn = request.NameEn;
		district.NameRu = request.NameRu;
		district.CityId = request.CityId;
		district.DisplayOrder = request.DisplayOrder;
		district.IsActive = request.IsActive;

		await dbContext.SaveChangesAsync(ct);

		return Result.Success();
	}
}
