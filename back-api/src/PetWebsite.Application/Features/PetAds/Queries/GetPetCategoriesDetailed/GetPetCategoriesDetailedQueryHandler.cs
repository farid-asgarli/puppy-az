using Microsoft.EntityFrameworkCore;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Application.Extensions;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Application.Features.PetAds.Queries.GetPetCategoriesDetailed;

public class GetPetCategoriesDetailedQueryHandler(IApplicationDbContext dbContext, ICurrentUserService currentUserService)
	: IQueryHandler<GetPetCategoriesDetailedQuery, Result<List<PetCategoryDetailedDto>>>
{
	public async Task<Result<List<PetCategoryDetailedDto>>> Handle(GetPetCategoriesDetailedQuery request, CancellationToken ct)
	{
		var currentCulture = currentUserService.CurrentCulture;

		var result = await dbContext
			.PetCategories.WhereNotDeleted<PetCategory, int>()
			.Where(c => c.IsActive)
			.AsNoTracking()
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

		return Result<List<PetCategoryDetailedDto>>.Success(result);
	}
}
