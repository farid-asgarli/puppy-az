using Common.Repository.Abstraction;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Application.Features.PetAds;
using PetWebsite.Application.Features.PetAds.Extensions;
using PetWebsite.Domain.Constants;
using PetWebsite.Domain.Enums;

namespace PetWebsite.Application.Features.FavoriteAds.Queries.GetUserFavoriteAds;

public class GetUserFavoriteAdsQueryHandler(
	IApplicationDbContext dbContext,
	ICurrentUserService currentUserService,
	IDynamicQueryRepository queryRepo,
	IStringLocalizer localizer,
	IUrlService urlService
) : BaseHandler(localizer), IQueryHandler<GetUserFavoriteAdsQuery, Result<PaginatedResult<PetAdListItemDto>>>
{
	public async Task<Result<PaginatedResult<PetAdListItemDto>>> Handle(GetUserFavoriteAdsQuery request, CancellationToken ct)
	{
		var userId = currentUserService.UserId;
		if (userId == null)
			return Result<PaginatedResult<PetAdListItemDto>>.Failure(L(LocalizationKeys.Error.Unauthorized), 401);

		var currentCulture = currentUserService.CurrentCulture;

		// Query favorite ads for the current user
		var query = dbContext
			.FavoriteAds.AsNoTracking()
			.Where(f => f.UserId == userId)
			.OrderByDescending(f => f.CreatedAt)
			.Select(f => f.PetAd)
			.Where(p => p.Status == PetAdStatus.Published && !p.IsDeleted && p.IsAvailable)
			.Select(PetAdProjections.ToListItemDto(currentCulture));

		var (items, totalCount) = await queryRepo.WithQuery(query).ApplyPagination(request.Pagination).ToListWithCountAsync(ct);

		// Convert relative image URLs to absolute URLs
		foreach (var item in items)
		{
			item.PrimaryImageUrl = urlService.ToAbsoluteUrl(item.PrimaryImageUrl);
		}

		var result = new PaginatedResult<PetAdListItemDto>
		{
			Items = items,
			TotalCount = totalCount,
			PageNumber = request.Pagination.Number ?? 1,
			PageSize = request.Pagination.Size ?? 10,
		};

		return Result<PaginatedResult<PetAdListItemDto>>.Success(result);
	}
}
