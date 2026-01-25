using Microsoft.EntityFrameworkCore;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Application.Extensions;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Application.Features.PetAds.Queries.GetPetColors;

public class GetPetColorsQueryHandler(IApplicationDbContext dbContext, ICurrentUserService currentUserService)
	: IQueryHandler<GetPetColorsQuery, Result<List<PetColorDto>>>
{
	public async Task<Result<List<PetColorDto>>> Handle(GetPetColorsQuery request, CancellationToken ct)
	{
		var currentCulture = currentUserService.CurrentCulture;

		var result = await dbContext
			.PetColors.WhereNotDeleted<PetColor, int>()
			.Where(c => c.IsActive)
			.AsNoTracking()
			.OrderBy(c => c.SortOrder)
			.ThenBy(c => c.Id)
			.Select(c => new PetColorDto
			{
				Id = c.Id,
				Key = c.Key,
				Title =
					c.Localizations.Where(l => l.AppLocale.Code == currentCulture || l.AppLocale.IsDefault)
						.OrderByDescending(l => l.AppLocale.Code == currentCulture)
						.Select(l => l.Title)
						.FirstOrDefault() ?? "",
				BackgroundColor = c.BackgroundColor,
				TextColor = c.TextColor,
				BorderColor = c.BorderColor,
			})
			.ToListAsync(ct);

		return Result<List<PetColorDto>>.Success(result);
	}
}
