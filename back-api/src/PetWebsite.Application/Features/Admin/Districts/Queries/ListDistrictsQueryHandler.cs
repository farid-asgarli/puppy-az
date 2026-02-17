using Common.Repository.Abstraction;
using Microsoft.EntityFrameworkCore;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Admin.Districts.Queries;

public class ListDistrictsQueryHandler(IApplicationDbContext dbContext, IDynamicQueryRepository queryRepo)
	: ICommandHandler<ListDistrictsQuery, PaginatedResult<DistrictListItemDto>>
{
	public async Task<PaginatedResult<DistrictListItemDto>> Handle(ListDistrictsQuery request, CancellationToken ct)
	{
		var query =
			from district in dbContext.Districts.AsNoTracking().Include(d => d.City)
			where !district.IsDeleted
			select new DistrictListItemDto
			{
				Id = district.Id,
				NameAz = district.NameAz,
				NameEn = district.NameEn,
				NameRu = district.NameRu,
				CityId = district.CityId,
				CityNameAz = district.City.NameAz,
				DisplayOrder = district.DisplayOrder,
				IsActive = district.IsActive,
				IsDeleted = district.IsDeleted,
				PetAdsCount = district.PetAds.Count(a => !a.IsDeleted),
				CreatedAt = district.CreatedAt,
			};

		if (request.CityId.HasValue)
			query = query.Where(d => d.CityId == request.CityId.Value);

		var (items, count) = await queryRepo
			.WithQuery(query)
			.ApplyFilters(request.Filter)
			.ApplyPagination(request.Pagination)
			.ToListWithCountAsync(ct);

		return new PaginatedResult<DistrictListItemDto>
		{
			Items = items,
			TotalCount = count,
			PageNumber = request.Pagination?.Number ?? 1,
			PageSize = request.Pagination?.Size ?? count,
		};
	}
}
