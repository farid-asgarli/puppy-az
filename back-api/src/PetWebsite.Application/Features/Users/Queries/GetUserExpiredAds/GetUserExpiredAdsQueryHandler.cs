using Common.Repository.Abstraction;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Application.Extensions;
using PetWebsite.Application.Features.PetAds;
using PetWebsite.Application.Features.PetAds.Extensions;
using PetWebsite.Domain.Constants;
using PetWebsite.Domain.Entities;
using PetWebsite.Domain.Enums;

namespace PetWebsite.Application.Features.Users.Queries.GetUserExpiredAds;

public class GetUserExpiredAdsQueryHandler(
	IApplicationDbContext dbContext,
	ICurrentUserService currentUserService,
	IDynamicQueryRepository queryRepo,
	IUrlService urlService,
	IStringLocalizer localizer
) : BaseHandler(localizer), IQueryHandler<GetUserExpiredAdsQuery, Result<PaginatedResult<MyPetAdListItemDto>>>
{
	public async Task<Result<PaginatedResult<MyPetAdListItemDto>>> Handle(GetUserExpiredAdsQuery request, CancellationToken ct)
	{
		var userId = currentUserService.UserId;
		if (userId == null)
			return Result<PaginatedResult<MyPetAdListItemDto>>.Failure(L(LocalizationKeys.Error.Unauthorized), 401);

		var currentCulture = currentUserService.CurrentCulture;

		// Get user's expired ads (status = Expired)
		var query = dbContext
			.PetAds.WhereNotDeleted<PetAd, int>()
			.AsNoTracking()
			.Where(p => p.UserId == userId && p.Status == PetAdStatus.Expired)
			.OrderByDescending(p => p.ExpiresAt)
			.Select(PetAdProjections.ToMyListItemDto(currentCulture));

		var (items, totalCount) = await queryRepo
			.WithQuery(query)
			.ApplyFilters(request.Filter)
			.ApplyPagination(request.Pagination)
			.ToListWithCountAsync(ct);

		// Convert relative image URLs to absolute URLs
		foreach (var item in items)
		{
			item.PrimaryImageUrl = urlService.ToAbsoluteUrl(item.PrimaryImageUrl);
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

		return Result<PaginatedResult<MyPetAdListItemDto>>.Success(result);
	}
}
