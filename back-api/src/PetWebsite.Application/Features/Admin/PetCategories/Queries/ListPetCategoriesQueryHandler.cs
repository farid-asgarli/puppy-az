using Common.Repository.Abstraction;
using Microsoft.EntityFrameworkCore;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Admin.PetCategories.Queries;

public class ListPetCategoriesQueryHandler(
	IApplicationDbContext dbContext,
	IDynamicQueryRepository queryRepo,
	ICurrentUserService currentUserService
) : ICommandHandler<ListPetCategoriesQuery, PaginatedResult<PetCategoryListItemDto>>
{
	public async Task<PaginatedResult<PetCategoryListItemDto>> Handle(ListPetCategoriesQuery request, CancellationToken ct)
	{
		var currentCulture = currentUserService.CurrentCulture;

		var query =
			from category in dbContext.PetCategories.AsNoTracking()
			let localization = category.Localizations.FirstOrDefault(l => l.AppLocale.Code == currentCulture)
				?? category.Localizations.FirstOrDefault(l => l.AppLocale.IsDefault)
			select new PetCategoryListItemDto
			{
				Id = category.Id,
				Title = localization != null ? localization.Title : "",
				Subtitle = localization != null ? localization.Subtitle : "",
				IconColor = category.IconColor,
				BackgroundColor = category.BackgroundColor,
				IsActive = category.IsActive,
				IsDeleted = category.IsDeleted,
				BreedsCount = category.Breeds.Count(b => !b.IsDeleted),
				CreatedAt = category.CreatedAt,
			};

		var (items, count) = await queryRepo
			.WithQuery(query)
			.ApplyFilters(request.Filter)
			.ApplyPagination(request.Pagination)
			.ToListWithCountAsync(ct);

		return new PaginatedResult<PetCategoryListItemDto>
		{
			Items = items,
			TotalCount = count,
			PageNumber = request.Pagination?.Number ?? 1,
			PageSize = request.Pagination?.Size ?? count,
		};
	}
}
