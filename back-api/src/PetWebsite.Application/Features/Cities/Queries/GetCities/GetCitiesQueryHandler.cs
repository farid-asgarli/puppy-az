using Microsoft.EntityFrameworkCore;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Cities.Queries.GetCities;

public class GetCitiesQueryHandler(
	IApplicationDbContext dbContext,
	ICurrentUserService currentUserService
) : IQueryHandler<GetCitiesQuery, Result<List<CityDto>>>
{
	public async Task<Result<List<CityDto>>> Handle(GetCitiesQuery request, CancellationToken ct)
	{
		var currentCulture = currentUserService.CurrentCulture;

		var cities = await dbContext
			.Cities.AsNoTracking()
			.Where(c => c.IsActive && !c.IsDeleted)
			.OrderBy(c => c.DisplayOrder)
			.ThenBy(c => c.NameAz)
			.Select(c => new CityDto
			{
				Id = c.Id,
				Name = currentCulture == "ru" ? c.NameRu : currentCulture == "en" ? c.NameEn : c.NameAz,
				IsMajorCity = c.IsMajorCity,
				DisplayOrder = c.DisplayOrder
			})
			.ToListAsync(ct);

		return Result<List<CityDto>>.Success(cities);
	}
}
