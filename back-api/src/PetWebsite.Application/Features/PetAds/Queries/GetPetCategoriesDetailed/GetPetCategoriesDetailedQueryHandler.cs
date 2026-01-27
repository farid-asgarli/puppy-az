using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Application.Extensions;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Application.Features.PetAds.Queries.GetPetCategoriesDetailed;

public class GetPetCategoriesDetailedQueryHandler(
	IApplicationDbContext dbContext, 
	ICurrentUserService currentUserService,
	ILogger<GetPetCategoriesDetailedQueryHandler> logger)
	: IQueryHandler<GetPetCategoriesDetailedQuery, Result<List<PetCategoryDetailedDto>>>
{
	public async Task<Result<List<PetCategoryDetailedDto>>> Handle(GetPetCategoriesDetailedQuery request, CancellationToken ct)
	{
		logger.LogDebug("[GetPetCategoriesDetailed] Starting query. RequestLocale: {RequestLocale}", request.LocaleCode);
		
		var currentCulture = request.LocaleCode ?? currentUserService.CurrentCulture;
		logger.LogDebug("[GetPetCategoriesDetailed] Using culture: {Culture}", currentCulture);

		var result = await dbContext
			.PetCategories.WhereNotDeleted<PetCategory, int>()
			.Where(c => c.IsActive)
			.AsNoTracking()
			.OrderBy(c => c.Id == 10 ? 1 : 0) // "Digər" always last
			.ThenBy(c => c.Id)
			.Select(c => new PetCategoryDetailedDto
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
				PetAdsCount = c.Breeds.SelectMany(b => b.PetAds).Count(a => a.Status == Domain.Enums.PetAdStatus.Published && !a.IsDeleted),
			})
			.ToListAsync(ct);

		logger.LogDebug("[GetPetCategoriesDetailed] Query completed. Found {Count} categories", result.Count);
		foreach (var cat in result)
		{
			logger.LogDebug("[GetPetCategoriesDetailed] Category {Id}: Title='{Title}', AdsCount={AdsCount}", cat.Id, cat.Title, cat.PetAdsCount);
		}

		return Result<List<PetCategoryDetailedDto>>.Success(result);
	}
}
