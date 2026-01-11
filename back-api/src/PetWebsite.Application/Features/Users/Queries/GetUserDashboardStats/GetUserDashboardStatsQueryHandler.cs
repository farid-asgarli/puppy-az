using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Application.Extensions;
using PetWebsite.Domain.Constants;
using PetWebsite.Domain.Entities;
using PetWebsite.Domain.Enums;

namespace PetWebsite.Application.Features.Users.Queries.GetUserDashboardStats;

public class GetUserDashboardStatsQueryHandler(
	IApplicationDbContext dbContext,
	ICurrentUserService currentUserService,
	IStringLocalizer localizer
) : BaseHandler(localizer), IQueryHandler<GetUserDashboardStatsQuery, Result<UserDashboardStatsDto>>
{
	public async Task<Result<UserDashboardStatsDto>> Handle(GetUserDashboardStatsQuery request, CancellationToken ct)
	{
		var userId = currentUserService.UserId;
		if (userId == null)
			return Result<UserDashboardStatsDto>.Failure(L(LocalizationKeys.Error.Unauthorized), 401);

		// Get all user's ads (not deleted)
		var userAds = await dbContext
			.PetAds.WhereNotDeleted<PetAd, int>()
			.Where(p => p.UserId == userId)
			.Select(it => new
			{
				it.Status,
				it.ViewCount,
				it.Id,
			})
			.ToListAsync(ct);

		// Calculate statistics
		var stats = new UserDashboardStatsDto
		{
			TotalAdCount = userAds.Count,
			ActiveAdCount = userAds.Count(a => a.Status == PetAdStatus.Published),
			PendingAdCount = userAds.Count(a => a.Status == PetAdStatus.Pending),
			RejectedAdCount = userAds.Count(a => a.Status == PetAdStatus.Rejected),
			TotalViews = userAds.Sum(a => a.ViewCount),
			TotalFavoriteCount = await dbContext.FavoriteAds.CountAsync(f => userAds.Select(a => a.Id).Contains(f.PetAdId), ct),
			TotalQuestions = await dbContext.PetAdQuestions.CountAsync(
				q => !q.IsDeleted && q.PetAd.UserId == userId && !q.PetAd.IsDeleted,
				ct
			),
			UnansweredQuestions = await dbContext.PetAdQuestions.CountAsync(
				q => !q.IsDeleted && q.PetAd.UserId == userId && !q.PetAd.IsDeleted && q.Answer == null,
				ct
			),
		};

		return Result<UserDashboardStatsDto>.Success(stats);
	}
}
