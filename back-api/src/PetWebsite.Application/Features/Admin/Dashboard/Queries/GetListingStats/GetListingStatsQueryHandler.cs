using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Application.Extensions;
using PetWebsite.Domain.Entities;
using PetWebsite.Domain.Enums;

namespace PetWebsite.Application.Features.Admin.Dashboard.Queries.GetListingStats;

/// <summary>
/// Handler for getting listing statistics for admin dashboard.
/// </summary>
public class GetListingStatsQueryHandler(
	IApplicationDbContext dbContext,
	IStringLocalizer localizer
) : BaseHandler(localizer), IQueryHandler<GetListingStatsQuery, Result<ListingStatsDto>>
{
	public async Task<Result<ListingStatsDto>> Handle(GetListingStatsQuery request, CancellationToken ct)
	{
		// Get all non-deleted ads grouped by status
		var statusCounts = await dbContext
			.PetAds
			.WhereNotDeleted<PetAd, int>()
			.GroupBy(p => p.Status)
			.Select(g => new { Status = g.Key, Count = g.Count() })
			.ToListAsync(ct);

		var stats = new ListingStatsDto
		{
			Total = statusCounts.Sum(s => s.Count),
			Active = statusCounts.FirstOrDefault(s => s.Status == PetAdStatus.Published)?.Count ?? 0,
			Pending = statusCounts.FirstOrDefault(s => s.Status == PetAdStatus.Pending)?.Count ?? 0,
			Rejected = statusCounts.FirstOrDefault(s => s.Status == PetAdStatus.Rejected)?.Count ?? 0,
			Expired = statusCounts.FirstOrDefault(s => s.Status == PetAdStatus.Expired)?.Count ?? 0,
		};

		return Result<ListingStatsDto>.Success(stats);
	}
}
