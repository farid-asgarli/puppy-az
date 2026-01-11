using Common.Repository.Abstraction;
using Microsoft.EntityFrameworkCore;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Application.Extensions;
using PetWebsite.Application.Features.PetAds.Extensions;
using PetWebsite.Domain.Entities;
using PetWebsite.Domain.Enums;

namespace PetWebsite.Application.Features.PetAds.Queries.GetPremiumPetAds;

public class GetPremiumPetAdsQueryHandler(
	IApplicationDbContext dbContext,
	ICurrentUserService currentUserService,
	IDynamicQueryRepository queryRepo,
	IUrlService urlService
) : IQueryHandler<GetPremiumPetAdsQuery, Result<PaginatedResult<PetAdListItemDto>>>
{
	public async Task<Result<PaginatedResult<PetAdListItemDto>>> Handle(GetPremiumPetAdsQuery request, CancellationToken ct)
	{
		var currentCulture = currentUserService.CurrentCulture;

		// Base query - only premium, published, not deleted, and available ads
		var query = dbContext
			.PetAds.WhereNotDeleted<PetAd, int>()
			.AsNoTracking()
			.Where(p => p.Status == PetAdStatus.Published && p.IsAvailable && p.IsPremium);

		// Order by published date (newest first)
		var orderedQuery = query.OrderByDescending(p => p.PublishedAt).Select(PetAdProjections.ToListItemDto(currentCulture));

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
