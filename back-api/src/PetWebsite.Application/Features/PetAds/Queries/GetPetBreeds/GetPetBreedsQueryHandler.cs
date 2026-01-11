using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Application.Extensions;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Application.Features.PetAds.Queries.GetPetBreeds;

public class GetPetBreedsQueryHandler(IApplicationDbContext dbContext, ICurrentUserService currentUserService, IStringLocalizer localizer)
	: BaseHandler(localizer),
		IQueryHandler<GetPetBreedsQuery, Result<List<PetBreedDto>>>
{
	public async Task<Result<List<PetBreedDto>>> Handle(GetPetBreedsQuery request, CancellationToken ct)
	{
		var currentCulture = currentUserService.CurrentCulture;

		// Base query - only active, not deleted breeds
		var query = dbContext.PetBreeds.WhereNotDeleted<PetBreed, int>().AsNoTracking().Where(b => b.IsActive);

		// Filter by category if provided
		if (request.PetCategoryId.HasValue)
			query = query.Where(b => b.PetCategoryId == request.PetCategoryId.Value);

		var breeds = await query
			.OrderBy(b => b.Id)
			.Select(b => new PetBreedDto
			{
				Id = b.Id,
				Title =
					b.Localizations.Where(l => l.AppLocale.Code == currentCulture || l.AppLocale.IsDefault)
						.OrderByDescending(l => l.AppLocale.Code == currentCulture)
						.Select(l => l.Title)
						.FirstOrDefault() ?? "",
				CategoryId = b.PetCategoryId,
			})
			.ToListAsync(ct);

		return Result<List<PetBreedDto>>.Success(breeds);
	}
}
