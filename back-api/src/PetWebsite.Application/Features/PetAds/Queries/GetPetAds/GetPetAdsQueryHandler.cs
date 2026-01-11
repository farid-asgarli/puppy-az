using Common.Repository.Abstraction;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Application.Extensions;
using PetWebsite.Application.Features.PetAds.Extensions;
using PetWebsite.Domain.Entities;
using PetWebsite.Domain.Enums;

namespace PetWebsite.Application.Features.PetAds.Queries.GetPetAds;

public class GetPetAdsQueryHandler(
	IApplicationDbContext dbContext,
	ICurrentUserService currentUserService,
	IDynamicQueryRepository queryRepo,
	IUrlService urlService,
	IStringLocalizer localizer
) : BaseHandler(localizer), IQueryHandler<GetPetAdsQuery, Result<PaginatedResult<PetAdListItemDto>>>
{
	public async Task<Result<PaginatedResult<PetAdListItemDto>>> Handle(GetPetAdsQuery request, CancellationToken ct)
	{
		var currentCulture = currentUserService.CurrentCulture;

		// Base query - only published, not deleted, and available ads
		var query = dbContext
			.PetAds.WhereNotDeleted<PetAd, int>()
			.AsNoTracking()
			.Where(p => p.Status == PetAdStatus.Published && p.IsAvailable);

		// Order by: Premium first, then by published date (newest first)
		var orderedQuery = query
			.OrderByDescending(p => p.IsPremium)
			.ThenByDescending(p => p.PublishedAt)
			.Select(PetAdProjections.ToListItemDto(currentCulture));

		var (items, totalCount) = await queryRepo
			.WithQuery(orderedQuery)
			.ApplyFilters(request.Filter)
			.ApplyPagination(request.Pagination)
			.ToListWithCountAsync(ct);

		// Convert relative image URLs to absolute URLs
		foreach (var item in items)
		{
			item.PrimaryImageUrl = urlService.ToAbsoluteUrl(item.PrimaryImageUrl);
		}

		var result = new PaginatedResult<PetAdListItemDto>
		{
			Items = items,
			TotalCount = totalCount,
			PageNumber = request.Pagination?.Number ?? 1,
			PageSize = request.Pagination?.Size ?? 10,
		};

		return Result<PaginatedResult<PetAdListItemDto>>.Success(result);
	}
}
