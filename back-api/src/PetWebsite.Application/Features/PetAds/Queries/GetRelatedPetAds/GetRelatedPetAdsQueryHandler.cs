using Common.Repository.Abstraction;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Application.Extensions;
using PetWebsite.Application.Features.PetAds.Extensions;
using PetWebsite.Domain.Constants;
using PetWebsite.Domain.Entities;
using PetWebsite.Domain.Enums;

namespace PetWebsite.Application.Features.PetAds.Queries.GetRelatedPetAds;

public class GetRelatedPetAdsQueryHandler(
	IApplicationDbContext dbContext,
	ICurrentUserService currentUserService,
	IDynamicQueryRepository queryRepo,
	IUrlService urlService,
	IStringLocalizer localizer
) : BaseHandler(localizer), IQueryHandler<GetRelatedPetAdsQuery, Result<PaginatedResult<PetAdListItemDto>>>
{
	public async Task<Result<PaginatedResult<PetAdListItemDto>>> Handle(GetRelatedPetAdsQuery request, CancellationToken ct)
	{
		var currentCulture = currentUserService.CurrentCulture;

		var sourcePetAd = await dbContext
			.PetAds.Where(p => p.Id == request.PetAdId && !p.IsDeleted)
			.Select(p => new { p.PetBreedId, p.Breed.PetCategoryId })
			.FirstOrDefaultAsync(ct);

		if (sourcePetAd == null)
			return Result<PaginatedResult<PetAdListItemDto>>.Failure(L(LocalizationKeys.PetAd.NotFound), 404);

		var query = dbContext
			.PetAds.WhereNotDeleted<PetAd, int>()
			.AsNoTracking()
			.Where(p =>
				p.Id != request.PetAdId
				&& p.Status == PetAdStatus.Published
				&& p.IsAvailable
				&& (p.PetBreedId == sourcePetAd.PetBreedId || p.Breed.PetCategoryId == sourcePetAd.PetCategoryId)
			)
			.OrderByDescending(p => p.IsPremium)
			.ThenByDescending(p => p.PublishedAt)
			.Select(PetAdProjections.ToListItemDto(currentCulture));

		var (items, totalCount) = await queryRepo
			.WithQuery(query)
			.ApplyPagination(request.Specification.Pagination)
			.ToListWithCountAsync(ct);

		foreach (var item in items)
		{
			item.PrimaryImageUrl = urlService.ToAbsoluteUrl(item.PrimaryImageUrl);
		}

		var result = new PaginatedResult<PetAdListItemDto>
		{
			Items = items,
			TotalCount = totalCount,
			PageNumber = request.Specification.Pagination?.Number ?? 1,
			PageSize = request.Specification.Pagination?.Size ?? 10,
		};

		return Result<PaginatedResult<PetAdListItemDto>>.Success(result);
	}
}
