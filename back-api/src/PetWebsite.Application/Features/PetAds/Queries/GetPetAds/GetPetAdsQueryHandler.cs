using Common.Repository.Abstraction;
using Common.Repository.Filtering;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
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
	IStringLocalizer localizer,
	ILogger<GetPetAdsQueryHandler> logger
) : BaseHandler(localizer), IQueryHandler<GetPetAdsQuery, Result<PaginatedResult<PetAdListItemDto>>>
{
	public async Task<Result<PaginatedResult<PetAdListItemDto>>> Handle(GetPetAdsQuery request, CancellationToken ct)
	{
		logger.LogDebug("[GetPetAds] Starting query. Filter: {Filter}, Pagination: Page {Page} Size {Size}", 
			request.Filter?.ToString() ?? "none", 
			request.Pagination?.Number ?? 1, 
			request.Pagination?.Size ?? 10);
		
		var currentCulture = currentUserService.CurrentCulture;
		logger.LogDebug("[GetPetAds] Using culture: {Culture}", currentCulture);

		// Base query - only published, not deleted, and available ads
		var query = dbContext
			.PetAds.WhereNotDeleted<PetAd, int>()
			.AsNoTracking()
			.Where(p => p.Status == PetAdStatus.Published && p.IsAvailable)
			.Select(PetAdProjections.ToListItemDto(currentCulture));

		var (items, totalCount) = await queryRepo
			.WithQuery(query)
			.ApplyFilters(request.Filter)
			// Premium ads always first, then apply user's sorting preference
			.OrderByDescending(p => p.IsPremium)
			.ApplySorting(request.Sorting, "PublishedAt", SortDirection.Descending)
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

		logger.LogDebug("[GetPetAds] Query completed. TotalCount: {TotalCount}, ItemsReturned: {ItemsCount}", totalCount, items.Count);

		return Result<PaginatedResult<PetAdListItemDto>>.Success(result);
	}
}
