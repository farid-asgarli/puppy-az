using Microsoft.EntityFrameworkCore;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Enums;

namespace PetWebsite.Application.Features.Public.Statistics.Queries.GetPublicStats;

/// <summary>
/// Handler for getting public statistics.
/// </summary>
public class GetPublicStatsQueryHandler(IApplicationDbContext dbContext) 
	: IQueryHandler<GetPublicStatsQuery, Result<PublicStatsDto>>
{
	public async Task<Result<PublicStatsDto>> Handle(GetPublicStatsQuery request, CancellationToken cancellationToken)
	{
		try
		{
			var activeAdsCount = await dbContext.PetAds
				.Where(a => a.Status == PetAdStatus.Published && !a.IsDeleted)
				.CountAsync(cancellationToken);

			var totalUsersCount = await dbContext.RegularUsers
				.CountAsync(cancellationToken);

			var stats = new PublicStatsDto
			{
				ActiveAds = activeAdsCount,
				TotalUsers = totalUsersCount
			};

			return Result<PublicStatsDto>.Success(stats);
		}
		catch (Exception ex)
		{
			return Result<PublicStatsDto>.Failure($"Failed to retrieve statistics: {ex.Message}");
		}
	}
}
