using Microsoft.EntityFrameworkCore;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Districts.Queries.GetDistrictsByCity;

public class GetDistrictsByCityQueryHandler(
	IApplicationDbContext dbContext,
	ICurrentUserService currentUserService
) : IQueryHandler<GetDistrictsByCityQuery, Result<List<DistrictDto>>>
{
	public async Task<Result<List<DistrictDto>>> Handle(GetDistrictsByCityQuery request, CancellationToken ct)
	{
		var currentCulture = currentUserService.CurrentCulture;

		var districts = await dbContext
			.Districts.AsNoTracking()
			.Where(d => d.CityId == request.CityId && d.IsActive && !d.IsDeleted)
			.OrderBy(d => d.DisplayOrder)
			.ThenBy(d => d.NameAz)
			.Select(d => new DistrictDto
			{
				Id = d.Id,
				Name = currentCulture == "ru" ? d.NameRu : currentCulture == "en" ? d.NameEn : d.NameAz,
				CityId = d.CityId
			})
			.ToListAsync(ct);

		return Result<List<DistrictDto>>.Success(districts);
	}
}
