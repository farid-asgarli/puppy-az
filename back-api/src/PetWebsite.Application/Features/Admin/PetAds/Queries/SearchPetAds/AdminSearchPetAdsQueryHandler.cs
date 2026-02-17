using Common.Repository.Abstraction;
using Common.Repository.Filtering;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Application.Extensions;
using PetWebsite.Application.Features.PetAds;
using PetWebsite.Application.Features.PetAds.Extensions;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Application.Features.Admin.PetAds.Queries.SearchPetAds;

public class AdminSearchPetAdsQueryHandler(
	IApplicationDbContext dbContext,
	ICurrentUserService currentUserService,
	IDynamicQueryRepository queryRepo,
	IUrlService urlService,
	IStringLocalizer localizer,
	ILogger<AdminSearchPetAdsQueryHandler> logger
) : BaseHandler(localizer), IQueryHandler<AdminSearchPetAdsQuery, Result<PaginatedResult<MyPetAdListItemDto>>>
{
	public async Task<Result<PaginatedResult<MyPetAdListItemDto>>> Handle(AdminSearchPetAdsQuery request, CancellationToken ct)
	{
		logger.LogDebug("[AdminSearchPetAds] Starting query. Filter: {Filter}, Pagination: Page {Page} Size {Size}", 
			request.Filter?.ToString() ?? "none", 
			request.Pagination?.Number ?? 1, 
			request.Pagination?.Size ?? 10);
		
		var currentCulture = currentUserService.CurrentCulture;
		logger.LogDebug("[AdminSearchPetAds] Using culture: {Culture}", currentCulture);

		// Base query - ALL ads (no status restriction for admin)
		var baseQuery = dbContext
			.PetAds.WhereNotDeleted<PetAd, int>()
			.AsNoTracking();

		// Log the number of base records
		var totalBeforeFilter = await baseQuery.CountAsync(ct);
		logger.LogInformation("[AdminSearchPetAds] Total ads before filter: {Count}", totalBeforeFilter);
		
		// Log filter details if provided
		if (request.Filter?.Entries != null && request.Filter.Entries.Any())
		{
			foreach (var filter in request.Filter.Entries)
			{
				logger.LogInformation("[AdminSearchPetAds] Filter: Key={Key}, Equation={Equation}, Value={Value}", 
					filter.Key, filter.Equation, filter.Value);
			}
		}

		var query = baseQuery.Select(PetAdProjections.ToMyListItemDto(currentCulture));

		var (items, totalCount) = await queryRepo
			.WithQuery(query)
			.ApplyFilters(request.Filter)
			.ApplySorting(request.Sorting, "PublishedAt", SortDirection.Descending)
			.ApplyPagination(request.Pagination)
			.ToListWithCountAsync(ct);

		// Convert relative image URLs to absolute URLs
		foreach (var item in items)
		{
			item.PrimaryImageUrl = urlService.ToAbsoluteUrl(item.PrimaryImageUrl);
			
			// Convert all image URLs to absolute URLs
			foreach (var image in item.Images)
			{
				image.Url = urlService.ToAbsoluteUrl(image.Url);
			}
		}

		var result = new PaginatedResult<MyPetAdListItemDto>
		{
			Items = items,
			TotalCount = totalCount,
			PageNumber = request.Pagination?.Number ?? 1,
			PageSize = request.Pagination?.Size ?? 10,
		};

		logger.LogDebug("[AdminSearchPetAds] Query completed. TotalCount: {TotalCount}, ItemsReturned: {ItemsCount}", totalCount, items.Count);

		return Result<PaginatedResult<MyPetAdListItemDto>>.Success(result);
	}
}
