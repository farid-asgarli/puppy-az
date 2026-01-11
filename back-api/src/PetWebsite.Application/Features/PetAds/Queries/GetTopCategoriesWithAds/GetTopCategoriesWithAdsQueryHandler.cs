using Microsoft.EntityFrameworkCore;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Application.Extensions;
using PetWebsite.Application.Features.PetAds.Extensions;
using PetWebsite.Domain.Entities;
using PetWebsite.Domain.Enums;

namespace PetWebsite.Application.Features.PetAds.Queries.GetTopCategoriesWithAds;

public class GetTopCategoriesWithAdsQueryHandler(
	IApplicationDbContext dbContext,
	ICurrentUserService currentUserService,
	IUrlService urlService
) : IQueryHandler<GetTopCategoriesWithAdsQuery, Result<List<CategoryWithAdsDto>>>
{
	public async Task<Result<List<CategoryWithAdsDto>>> Handle(GetTopCategoriesWithAdsQuery request, CancellationToken ct)
	{
		var currentCulture = currentUserService.CurrentCulture;

		// Get top 10 categories with ad counts (optimized SQL query)
		var categoriesWithCounts = await dbContext
			.PetCategories.WhereNotDeleted<PetCategory, int>()
			.AsNoTracking()
			.Include(c => c.Localizations)
			.ThenInclude(l => l.AppLocale)
			.Where(c => c.IsActive)
			.Select(c => new
			{
				Category = c,
				PetAdsCount = c
					.Breeds.SelectMany(b => b.PetAds)
					.Count(a => a.Status == PetAdStatus.Published && !a.IsDeleted && a.IsAvailable),
			})
			.Where(x => x.PetAdsCount > 0)
			.OrderByDescending(x => x.PetAdsCount)
			.Take(10)
			.ToListAsync(ct);

		// Fetch pet ads for these categories (separate optimized query)
		var categoryIds = categoriesWithCounts.Select(x => x.Category.Id).ToList();
		var petAdsQuery = await dbContext
			.PetAds.WhereNotDeleted<PetAd, int>()
			.AsNoTracking()
			.Where(p => p.Status == PetAdStatus.Published && p.IsAvailable && categoryIds.Contains(p.Breed.PetCategoryId))
			.OrderByDescending(p => p.IsPremium)
			.ThenByDescending(p => p.PublishedAt)
			.Select(PetAdProjections.ToListItemDto(currentCulture))
			.ToListAsync(ct);

		// Group and map in memory (minimal processing)
		var result = categoriesWithCounts
			.Select(x =>
			{
				var c = x.Category;
				return new CategoryWithAdsDto
				{
					Id = c.Id,
					Title =
						c.Localizations.Where(l => l.AppLocale.Code == currentCulture || l.AppLocale.IsDefault)
							.OrderByDescending(l => l.AppLocale.Code == currentCulture)
							.Select(l => l.Title)
							.FirstOrDefault() ?? "",
					Subtitle =
						c.Localizations.Where(l => l.AppLocale.Code == currentCulture || l.AppLocale.IsDefault)
							.OrderByDescending(l => l.AppLocale.Code == currentCulture)
							.Select(l => l.Subtitle)
							.FirstOrDefault() ?? "",
					SvgIcon = c.SvgIcon,
					IconColor = c.IconColor,
					BackgroundColor = c.BackgroundColor,
					PetAdsCount = x.PetAdsCount,
					PetAds =
					[
						.. petAdsQuery
							.Where(ad => ad.CategoryId == c.Id)
							.Take(7)
							.Select(ad =>
							{
								ad.PrimaryImageUrl = urlService.ToAbsoluteUrl(ad.PrimaryImageUrl);
								return ad;
							}),
					],
				};
			})
			.ToList();

		return Result<List<CategoryWithAdsDto>>.Success(result);
	}
}
