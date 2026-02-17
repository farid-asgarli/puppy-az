using Microsoft.EntityFrameworkCore;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Application.Extensions;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Application.Features.PetAds.Queries.GetPetAdTypes;

/// <summary>
/// Handler to get all active pet ad types with localized content.
/// </summary>
public class GetPetAdTypesQueryHandler(IApplicationDbContext dbContext, ICurrentUserService currentUserService)
	: IQueryHandler<GetPetAdTypesQuery, Result<List<PetAdTypePublicDto>>>
{
	public async Task<Result<List<PetAdTypePublicDto>>> Handle(GetPetAdTypesQuery request, CancellationToken cancellationToken)
	{
		var currentCulture = currentUserService.CurrentCulture;

		var petAdTypes = await dbContext.PetAdTypes
			.WhereNotDeleted<PetAdTypeEntity, int>()
			.AsNoTracking()
			.Where(x => x.IsActive)
			.OrderBy(x => x.SortOrder)
			.ThenBy(x => x.Id)
			.Select(x => new PetAdTypePublicDto
			{
				Id = x.Id,
				Key = x.Key,
				Emoji = x.Emoji ?? string.Empty,
				BackgroundColor = x.BackgroundColor ?? string.Empty,
				TextColor = x.TextColor ?? string.Empty,
				BorderColor = x.BorderColor ?? string.Empty,
				Title = x.Localizations
					.Where(l => l.AppLocale.Code == currentCulture || l.AppLocale.IsDefault)
					.OrderByDescending(l => l.AppLocale.Code == currentCulture)
					.Select(l => l.Title)
					.FirstOrDefault() ?? x.Key,
				Description = x.Localizations
					.Where(l => l.AppLocale.Code == currentCulture || l.AppLocale.IsDefault)
					.OrderByDescending(l => l.AppLocale.Code == currentCulture)
					.Select(l => l.Description)
					.FirstOrDefault()
			})
			.ToListAsync(cancellationToken);

		return Result<List<PetAdTypePublicDto>>.Success(petAdTypes);
	}
}
