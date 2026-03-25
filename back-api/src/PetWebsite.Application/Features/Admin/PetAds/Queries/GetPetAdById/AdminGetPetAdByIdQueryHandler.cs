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

namespace PetWebsite.Application.Features.Admin.PetAds.Queries.GetPetAdById;

public class AdminGetPetAdByIdQueryHandler(
	IApplicationDbContext dbContext,
	ICurrentUserService currentUserService,
	IUrlService urlService,
	IStringLocalizer localizer,
	ILogger<AdminGetPetAdByIdQueryHandler> logger
) : BaseHandler(localizer), IQueryHandler<AdminGetPetAdByIdQuery, Result<MyPetAdListItemDto>>
{
	public async Task<Result<MyPetAdListItemDto>> Handle(AdminGetPetAdByIdQuery request, CancellationToken ct)
	{
		logger.LogDebug("[AdminGetPetAdById] Fetching pet ad Id={Id}", request.Id);
		var currentCulture = currentUserService.CurrentCulture;

		var item = await dbContext
			.PetAds.WhereNotDeleted<PetAd, int>()
			.AsNoTracking()
			.Where(p => p.Id == request.Id)
			.Select(PetAdProjections.ToMyListItemDto(currentCulture))
			.FirstOrDefaultAsync(ct);

		if (item is null)
		{
			logger.LogWarning("[AdminGetPetAdById] Pet ad Id={Id} not found (or soft-deleted)", request.Id);
			return Result<MyPetAdListItemDto>.NotFound(L("PetAd.NotFound"));
		}

		logger.LogDebug("[AdminGetPetAdById] Found ad Id={Id} Status={Status} IsDeleted={IsDeleted}",
			request.Id, item.Status, false);

		// Convert relative image URLs to absolute URLs
		item.PrimaryImageUrl = urlService.ToAbsoluteUrl(item.PrimaryImageUrl);
		foreach (var image in item.Images)
		{
			image.Url = urlService.ToAbsoluteUrl(image.Url);
		}

		return Result<MyPetAdListItemDto>.Success(item);
	}
}
