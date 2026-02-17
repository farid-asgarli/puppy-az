using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Application.Extensions;
using PetWebsite.Domain.Constants;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Application.Features.Admin.Districts.Commands.Create;

public class CreateDistrictCommandHandler(IApplicationDbContext dbContext, IStringLocalizer localizer)
	: BaseHandler(localizer),
		ICommandHandler<CreateDistrictCommand, Result<int>>
{
	public async Task<Result<int>> Handle(CreateDistrictCommand request, CancellationToken ct)
	{
		// Verify city exists
		var cityExists = await dbContext.Cities
			.WhereNotDeleted<City, int>()
			.AnyAsync(c => c.Id == request.CityId, ct);

		if (!cityExists)
			return Result<int>.Failure(L(LocalizationKeys.City.NotFound), 404);

		// Check if district with same name already exists in the same city
		var existingDistrict = await dbContext.Districts
			.WhereNotDeleted<District, int>()
			.FirstOrDefaultAsync(
				d => d.CityId == request.CityId
					&& (d.NameAz == request.NameAz || d.NameEn == request.NameEn || d.NameRu == request.NameRu),
				ct
			);

		if (existingDistrict != null)
			return Result<int>.Success(existingDistrict.Id, 200);

		var district = new District
		{
			NameAz = request.NameAz,
			NameEn = request.NameEn,
			NameRu = request.NameRu,
			CityId = request.CityId,
			DisplayOrder = request.DisplayOrder,
			IsActive = request.IsActive,
		};

		dbContext.Districts.Add(district);
		await dbContext.SaveChangesAsync(ct);

		return Result<int>.Success(district.Id, 201);
	}
}
