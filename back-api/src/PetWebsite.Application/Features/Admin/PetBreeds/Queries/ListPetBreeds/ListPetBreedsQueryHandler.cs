using Common.Repository.Abstraction;
using Microsoft.EntityFrameworkCore;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Entities;

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

		IQueryable<PetBreed> breedsQuery = dbContext.PetBreeds.AsNoTracking()
			.Include(b => b.Localizations)
				.ThenInclude(l => l.AppLocale);

		// Filter by category if provided
		if (request.PetCategoryId.HasValue)
			breedsQuery = breedsQuery.Where(b => b.PetCategoryId == request.PetCategoryId.Value);

		// Filter deleted items
		if (request.IncludeDeleted != true)
			breedsQuery = breedsQuery.Where(b => !b.IsDeleted);

		var query =
			from breed in breedsQuery
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
				Localizations = breed.Localizations.Select(l => new PetBreedLocalizationDto
				{
					Id = l.Id,
					PetBreedId = l.PetBreedId,
					LocaleCode = l.AppLocale.Code,
					Title = l.Title
				}).ToList(),
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
