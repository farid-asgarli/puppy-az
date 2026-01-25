using Microsoft.EntityFrameworkCore;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Application.Extensions;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Application.Features.PetAds.Queries.GetPetCategories;

public class GetPetCategoriesQueryHandler(IApplicationDbContext dbContext, ICurrentUserService currentUserService)
	: IQueryHandler<GetPetCategoriesQuery, Result<List<PetCategoryDto>>>
{
	public async Task<Result<List<PetCategoryDto>>> Handle(GetPetCategoriesQuery request, CancellationToken ct)
	{
		var currentCulture = currentUserService.CurrentCulture;

		var result = await dbContext
			.PetCategories.WhereNotDeleted<PetCategory, int>()
			.Where(c => c.IsActive)
			.AsNoTracking()
			.OrderBy(c => c.Id == 10 ? 1 : 0) // "Digər" always last
			.ThenBy(c => c.Id)
			.Select(c => new PetCategoryDto
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
			})
			.ToListAsync(ct);

		return Result<List<PetCategoryDto>>.Success(result);
	}
}
