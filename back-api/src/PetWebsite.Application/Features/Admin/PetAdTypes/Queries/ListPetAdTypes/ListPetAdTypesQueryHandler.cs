using Common.Repository.Abstraction;
using Microsoft.EntityFrameworkCore;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Admin.PetAdTypes.Queries.ListPetAdTypes;

public class ListPetAdTypesQueryHandler(IApplicationDbContext dbContext, IDynamicQueryRepository queryRepo)
	: ICommandHandler<ListPetAdTypesQuery, PaginatedResult<PetAdTypeListItemDto>>
{
	public async Task<PaginatedResult<PetAdTypeListItemDto>> Handle(ListPetAdTypesQuery request, CancellationToken ct)
	{
		var query =
			from petAdType in dbContext.PetAdTypes.AsNoTracking()
			where !petAdType.IsDeleted
			let azLocalization = petAdType.Localizations.FirstOrDefault(l => l.AppLocale.Code == "az")
			let enLocalization = petAdType.Localizations.FirstOrDefault(l => l.AppLocale.Code == "en")
			let ruLocalization = petAdType.Localizations.FirstOrDefault(l => l.AppLocale.Code == "ru")
			select new PetAdTypeListItemDto
			{
				Id = petAdType.Id,
				Key = petAdType.Key,
				Emoji = petAdType.Emoji,
				IconName = petAdType.IconName,
				BackgroundColor = petAdType.BackgroundColor,
				TextColor = petAdType.TextColor,
				BorderColor = petAdType.BorderColor,
				SortOrder = petAdType.SortOrder,
				IsActive = petAdType.IsActive,
				IsDeleted = petAdType.IsDeleted,
				TitleAz = azLocalization != null ? azLocalization.Title : string.Empty,
				TitleEn = enLocalization != null ? enLocalization.Title : string.Empty,
				TitleRu = ruLocalization != null ? ruLocalization.Title : string.Empty,
				DescriptionAz = azLocalization != null ? azLocalization.Description : null,
				DescriptionEn = enLocalization != null ? enLocalization.Description : null,
				DescriptionRu = ruLocalization != null ? ruLocalization.Description : null,
				PetAdsCount = 0, // TODO: Add when PetAds have PetAdTypeId relationship
				CreatedAt = petAdType.CreatedAt,
			};

		var (items, count) = await queryRepo
			.WithQuery(query)
			.ApplyFilters(request.Filter)
			.ApplyPagination(request.Pagination)
			.ToListWithCountAsync(ct);

		return new PaginatedResult<PetAdTypeListItemDto>
		{
			Items = items,
			TotalCount = count,
			PageNumber = request.Pagination?.Number ?? 1,
			PageSize = request.Pagination?.Size ?? count,
		};
	}
}
