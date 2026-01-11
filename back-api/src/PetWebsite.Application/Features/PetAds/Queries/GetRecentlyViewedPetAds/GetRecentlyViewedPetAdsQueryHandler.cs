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

namespace PetWebsite.Application.Features.PetAds.Queries.GetRecentlyViewedPetAds;

public class GetRecentlyViewedPetAdsQueryHandler(
	IApplicationDbContext dbContext,
	ICurrentUserService currentUserService,
	IDynamicQueryRepository queryRepo,
	IUrlService urlService,
	IStringLocalizer localizer
) : BaseHandler(localizer), IQueryHandler<GetRecentlyViewedPetAdsQuery, Result<PaginatedResult<PetAdListItemDto>>>
{
	public async Task<Result<PaginatedResult<PetAdListItemDto>>> Handle(GetRecentlyViewedPetAdsQuery request, CancellationToken ct)
	{
		// Get current user ID
		var userId = currentUserService.UserId;
		if (userId is null)
			return Result<PaginatedResult<PetAdListItemDto>>.Failure(L(LocalizationKeys.Error.Unauthorized), 401);

		var currentCulture = currentUserService.CurrentCulture;

		// First, get the latest view time for each pet ad
		var viewedAdsWithDate = await dbContext
			.PetAdViews.AsNoTracking()
			.Where(v => v.UserId == userId.Value)
			.GroupBy(v => v.PetAdId)
			.Select(g => new { PetAdId = g.Key, LastViewedAt = g.Max(v => v.ViewedAt) })
			.OrderByDescending(x => x.LastViewedAt)
			.ToListAsync(ct);

		var petAdIds = viewedAdsWithDate.Select(x => x.PetAdId).ToList();

		if (petAdIds.Count == 0)
		{
			// User hasn't viewed any ads yet
			return Result<PaginatedResult<PetAdListItemDto>>.Success(
				new PaginatedResult<PetAdListItemDto>
				{
					Items = [],
					TotalCount = 0,
					PageNumber = request.Pagination?.Number ?? 1,
					PageSize = request.Pagination?.Size ?? 10,
				}
			);
		}

		// Get the pet ads for these IDs
		var query = dbContext
			.PetAds.WhereNotDeleted<PetAd, int>()
			.AsNoTracking()
			.Where(p => petAdIds.Contains(p.Id))
			.Select(PetAdProjections.ToListItemDto(currentCulture));

		var (items, totalCount) = await queryRepo
			.WithQuery(query)
			.ApplyFilters(request.Filter)
			.ApplyPagination(request.Pagination)
			.ToListWithCountAsync(ct);

		// Order items by the view date (maintain the recently viewed order)
		var viewDateLookup = viewedAdsWithDate.ToDictionary(x => x.PetAdId, x => x.LastViewedAt);
		items = items.OrderByDescending(item => viewDateLookup.GetValueOrDefault(item.Id, DateTime.MinValue)).ToList();

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
