using Microsoft.EntityFrameworkCore;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Enums;

namespace PetWebsite.Application.Features.Admin.Dashboard.Queries.GetDashboardStats;

public class GetDashboardStatsQueryHandler(IApplicationDbContext dbContext)
	: IQueryHandler<GetDashboardStatsQuery, Result<DashboardStatsDto>>
{
	public async Task<Result<DashboardStatsDto>> Handle(GetDashboardStatsQuery request, CancellationToken ct)
	{
		var today = DateTime.UtcNow.Date;
		var last24Hours = DateTime.UtcNow.AddHours(-24);

		// Get all pet ad stats in one query
		var petAdStats = await dbContext.PetAds
			.Where(p => !p.IsDeleted)
			.GroupBy(_ => 1)
			.Select(g => new
			{
				Total = g.Count(),
				Active = g.Count(p => p.Status == PetAdStatus.Published),
				Pending = g.Count(p => p.Status == PetAdStatus.Pending),
				Rejected = g.Count(p => p.Status == PetAdStatus.Rejected),
				Expired = g.Count(p => p.Status == PetAdStatus.Expired),
				Premium = g.Count(p => p.IsPremium && p.Status == PetAdStatus.Published),
				TotalViews = g.Sum(p => p.ViewCount),
				TodayCreated = g.Count(p => p.CreatedAt >= today),
			})
			.FirstOrDefaultAsync(ct);

		// Get user stats
		var userStats = await dbContext.RegularUsers
			.GroupBy(_ => 1)
			.Select(g => new
			{
				Total = g.Count(),
				TodayRegistered = g.Count(u => u.CreatedAt >= today),
			})
			.FirstOrDefaultAsync(ct);

		// Get contact message stats - count new (unread) contact messages
		var newMessagesCount = await dbContext.ContactMessages
			.CountAsync(m => m.Status == ContactMessageStatus.New, ct);

		// Get questions count
		var questionsCount = await dbContext.PetAdQuestions.CountAsync(ct);

		// Get favorites count
		var favoritesCount = await dbContext.FavoriteAds.CountAsync(ct);

		var stats = new DashboardStatsDto
		{
			TotalListings = petAdStats?.Total ?? 0,
			ActiveListings = petAdStats?.Active ?? 0,
			PendingApprovals = petAdStats?.Pending ?? 0,
			RejectedListings = petAdStats?.Rejected ?? 0,
			ExpiredListings = petAdStats?.Expired ?? 0,
			PremiumListings = petAdStats?.Premium ?? 0,
			TotalViews = petAdStats?.TotalViews ?? 0,
			TodayListings = petAdStats?.TodayCreated ?? 0,
			TotalUsers = userStats?.Total ?? 0,
			TodayUsers = userStats?.TodayRegistered ?? 0,
			NewMessages = newMessagesCount,
			TotalQuestions = questionsCount,
			TotalFavorites = favoritesCount,
		};

		return Result<DashboardStatsDto>.Success(stats);
	}
}
