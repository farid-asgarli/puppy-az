using Microsoft.EntityFrameworkCore;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Application.Extensions;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Application.Features.PetAds.Queries.GetBreedBySlug;

public class GetBreedBySlugQueryHandler(IApplicationDbContext dbContext, ICurrentUserService currentUserService)
	: IQueryHandler<GetBreedBySlugQuery, Result<PetBreedWithCategoryDto>>
{
	public async Task<Result<PetBreedWithCategoryDto>> Handle(GetBreedBySlugQuery request, CancellationToken ct)
	{
		var currentCulture = currentUserService.CurrentCulture;

		var result = await dbContext
			.PetBreeds.WhereNotDeleted<PetBreed, int>()
			.Where(b => b.IsActive)
			.Where(b => b.Localizations.Any(l => l.Slug == request.BreedSlug && l.AppLocale.Code == currentCulture))
			.Where(b => b.Category.Localizations.Any(l => l.Slug == request.CategorySlug && l.AppLocale.Code == currentCulture))
			.AsNoTracking()
			.Select(b => new PetBreedWithCategoryDto
			{
				Id = b.Id,
				Title =
					b.Localizations.Where(l => l.AppLocale.Code == currentCulture || l.AppLocale.IsDefault)
						.OrderByDescending(l => l.AppLocale.Code == currentCulture)
						.Select(l => l.Title)
						.FirstOrDefault() ?? "",
				Slug =
					b.Localizations.Where(l => l.AppLocale.Code == currentCulture || l.AppLocale.IsDefault)
						.OrderByDescending(l => l.AppLocale.Code == currentCulture)
						.Select(l => l.Slug)
						.FirstOrDefault() ?? "",
				CategoryId = b.PetCategoryId,
				CategoryTitle =
					b.Category.Localizations.Where(l => l.AppLocale.Code == currentCulture || l.AppLocale.IsDefault)
						.OrderByDescending(l => l.AppLocale.Code == currentCulture)
						.Select(l => l.Title)
						.FirstOrDefault() ?? "",
				CategorySlug =
					b.Category.Localizations.Where(l => l.AppLocale.Code == currentCulture || l.AppLocale.IsDefault)
						.OrderByDescending(l => l.AppLocale.Code == currentCulture)
						.Select(l => l.Slug)
						.FirstOrDefault() ?? "",
			})
			.FirstOrDefaultAsync(ct);

		if (result == null)
			return Result<PetBreedWithCategoryDto>.Failure("Breed not found");

		return Result<PetBreedWithCategoryDto>.Success(result);
	}
}
