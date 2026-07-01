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

		// "Posted by" filter. This compares two columns (CreatedBy vs UserId),
		// which the generic key/value filter cannot express, so we handle it
		// here on the entity query and strip it from the generic filter entries.
		// Admin-created ads have a creator (CreatedBy) that differs from the
		// owner (UserId); self-posted ads are created by the owner themselves.
		var filter = request.Filter;
		if (filter?.Entries is not null)
		{
			var postedByEntry = filter.Entries.FirstOrDefault(e =>
				string.Equals(e.Key, "IsAdminPosted", StringComparison.OrdinalIgnoreCase));

			if (postedByEntry is not null)
			{
				var isAdminPosted =
					postedByEntry.Value.ValueKind == System.Text.Json.JsonValueKind.True
					|| (postedByEntry.Value.ValueKind == System.Text.Json.JsonValueKind.String
						&& bool.TryParse(postedByEntry.Value.GetString(), out var parsed) && parsed);

				baseQuery = isAdminPosted
					? baseQuery.Where(p => p.CreatedBy != null && p.CreatedBy != p.UserId)
					: baseQuery.Where(p => p.CreatedBy == null || p.CreatedBy == p.UserId);

				// Pass the remaining entries (without IsAdminPosted) to the generic filter.
				var remaining = filter.Entries
					.Where(e => !string.Equals(e.Key, "IsAdminPosted", StringComparison.OrdinalIgnoreCase))
					.ToList();

				filter = remaining.Count > 0
					? new FilterSpecification { Entries = remaining, LogicalOperator = filter.LogicalOperator }
					: null;
			}
		}

		// Log the number of base records
		var totalBeforeFilter = await baseQuery.CountAsync(ct);
		logger.LogInformation("[AdminSearchPetAds] Total ads before filter: {Count}", totalBeforeFilter);
		
		// Log filter details if provided
		if (filter?.Entries != null && filter.Entries.Any())
		{
			foreach (var f in filter.Entries)
			{
				logger.LogInformation("[AdminSearchPetAds] Filter: Key={Key}, Equation={Equation}, Value={Value}", 
					f.Key, f.Equation, f.Value);
			}
		}

		var query = baseQuery.Select(PetAdProjections.ToMyListItemDto(currentCulture));

		var (items, totalCount) = await queryRepo
			.WithQuery(query)
			.ApplyFilters(filter)
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
