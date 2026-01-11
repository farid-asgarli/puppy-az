using Microsoft.EntityFrameworkCore;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Cities.Queries.GetCities;

public class GetCitiesQueryHandler(IApplicationDbContext dbContext) : IQueryHandler<GetCitiesQuery, Result<List<CityDto>>>
{
	public async Task<Result<List<CityDto>>> Handle(GetCitiesQuery request, CancellationToken ct)
	{
		var cities = await dbContext
			.Cities.AsNoTracking()
			.Where(c => c.IsActive && !c.IsDeleted)
			.OrderBy(c => c.Name)
			.Select(c => new CityDto { Id = c.Id, Name = c.Name })
			.ToListAsync(ct);

		return Result<List<CityDto>>.Success(cities);
	}
}
