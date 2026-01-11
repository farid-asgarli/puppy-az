namespace PetWebsite.Application.Features.Users;

/// <summary>
/// DTO representing user dashboard statistics.
/// </summary>
public class UserDashboardStatsDto
{
	public int TotalAdCount { get; init; }
	public int ActiveAdCount { get; init; }
	public int PendingAdCount { get; init; }
	public int RejectedAdCount { get; init; }
	public int TotalViews { get; init; }
	public int TotalFavoriteCount { get; init; }
	public int TotalQuestions { get; init; }
	public int UnansweredQuestions { get; init; }
}
