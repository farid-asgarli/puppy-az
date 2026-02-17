using Microsoft.EntityFrameworkCore;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Application.Extensions;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Application.Features.PetAds.Queries.GetCategoryBySlug;

public class GetCategoryBySlugQueryHandler(IApplicationDbContext dbContext, ICurrentUserService currentUserService)
	: IQueryHandler<GetCategoryBySlugQuery, Result<PetCategoryDetailedDto>>
{
	public async Task<Result<PetCategoryDetailedDto>> Handle(GetCategoryBySlugQuery request, CancellationToken ct)
	{
		var currentCulture = currentUserService.CurrentCulture;

		var result = await dbContext
			.PetCategories.WhereNotDeleted<PetCategory, int>()
			.Where(c => c.IsActive)
			.Where(c => c.Localizations.Any(l => l.Slug == request.Slug && l.AppLocale.Code == currentCulture))
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
				Slug =
					c.Localizations.Where(l => l.AppLocale.Code == currentCulture || l.AppLocale.IsDefault)
						.OrderByDescending(l => l.AppLocale.Code == currentCulture)
						.Select(l => l.Slug)
						.FirstOrDefault() ?? "",
				SvgIcon = c.SvgIcon,
				IconColor = c.IconColor,
				BackgroundColor = c.BackgroundColor,
				PetAdsCount = c.Breeds.SelectMany(b => b.PetAds).Count(a => a.Status == Domain.Enums.PetAdStatus.Published && !a.IsDeleted),
			})
			.FirstOrDefaultAsync(ct);

		if (result == null)
			return Result<PetCategoryDetailedDto>.Failure("Category not found");

		return Result<PetCategoryDetailedDto>.Success(result);
	}
}
