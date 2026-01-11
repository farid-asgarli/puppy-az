using Common.Repository.Abstraction;
using Microsoft.EntityFrameworkCore;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Admin.PetBreeds.Queries.ListPetBreeds;

public class ListPetBreedsQueryHandler(
	IApplicationDbContext dbContext,
	IDynamicQueryRepository queryRepo,
	ICurrentUserService currentUserService
) : ICommandHandler<ListPetBreedsQuery, PaginatedResult<PetBreedListItemDto>>
{
	public async Task<PaginatedResult<PetBreedListItemDto>> Handle(ListPetBreedsQuery request, CancellationToken ct)
	{
		var currentCulture = currentUserService.CurrentCulture;

		var query =
			from breed in dbContext.PetBreeds.AsNoTracking()
			let breedLocalization = breed.Localizations.FirstOrDefault(l => l.AppLocale.Code == currentCulture)
				?? breed.Localizations.FirstOrDefault(l => l.AppLocale.IsDefault)
			let categoryLocalization = breed.Category.Localizations.FirstOrDefault(l => l.AppLocale.Code == currentCulture)
				?? breed.Category.Localizations.FirstOrDefault(l => l.AppLocale.IsDefault)
			select new PetBreedListItemDto
			{
				Id = breed.Id,
				Title = breedLocalization != null ? breedLocalization.Title : "",
				IsActive = breed.IsActive,
				IsDeleted = breed.IsDeleted,
				PetCategoryId = breed.PetCategoryId,
				CategoryTitle = categoryLocalization != null ? categoryLocalization.Title : "",
				PetAdsCount = breed.PetAds.Count(a => !a.IsDeleted),
				CreatedAt = breed.CreatedAt,
			};

		var (items, count) = await queryRepo
			.WithQuery(query)
			.ApplyFilters(request.Filter)
			.ApplyPagination(request.Pagination)
			.ToListWithCountAsync(ct);

		return new PaginatedResult<PetBreedListItemDto>
		{
			Items = items,
			TotalCount = count,
			PageNumber = request.Pagination?.Number ?? 1,
			PageSize = request.Pagination?.Size ?? count,
		};
	}
}
