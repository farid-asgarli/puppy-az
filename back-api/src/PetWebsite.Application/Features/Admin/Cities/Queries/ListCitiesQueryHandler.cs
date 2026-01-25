using Common.Repository.Abstraction;
using Microsoft.EntityFrameworkCore;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Admin.Cities.Queries;

public class ListCitiesQueryHandler(IApplicationDbContext dbContext, IDynamicQueryRepository queryRepo)
	: ICommandHandler<ListCitiesQuery, PaginatedResult<CityListItemDto>>
{
	public async Task<PaginatedResult<CityListItemDto>> Handle(ListCitiesQuery request, CancellationToken ct)
	{
		var query =
			from city in dbContext.Cities.AsNoTracking()
			select new CityListItemDto
			{
				Id = city.Id,
				NameAz = city.NameAz,
				NameEn = city.NameEn,
				NameRu = city.NameRu,
				IsMajorCity = city.IsMajorCity,
				DisplayOrder = city.DisplayOrder,
				IsActive = city.IsActive,
				IsDeleted = city.IsDeleted,
				PetAdsCount = city.PetAds.Count(a => !a.IsDeleted),
				CreatedAt = city.CreatedAt,
			};

		var (items, count) = await queryRepo
			.WithQuery(query)
			.ApplyFilters(request.Filter)
			.ApplyPagination(request.Pagination)
			.ToListWithCountAsync(ct);

		return new PaginatedResult<CityListItemDto>
		{
			Items = items,
			TotalCount = count,
			PageNumber = request.Pagination?.Number ?? 1,
			PageSize = request.Pagination?.Size ?? count,
		};
	}
}
