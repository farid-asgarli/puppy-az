namespace PetWebsite.Application.Features.Admin.Dashboard.Queries.GetDashboardStats;

/// <summary>
/// DTO representing admin dashboard statistics.
/// </summary>
public class DashboardStatsDto
{
	/// <summary>
	/// Total number of pet ad listings.
	/// </summary>
	public int TotalListings { get; set; }

	/// <summary>
	/// Total number of registered users.
	/// </summary>
	public int TotalUsers { get; set; }

	/// <summary>
	/// Number of pending approval listings.
	/// </summary>
	public int PendingApprovals { get; set; }

	/// <summary>
	/// Number of new/unread messages (last 24 hours).
	/// </summary>
	public int NewMessages { get; set; }

	/// <summary>
	/// Number of premium listings.
	/// </summary>
	public int PremiumListings { get; set; }

	/// <summary>
	/// Total view count across all listings.
	/// </summary>
	public int TotalViews { get; set; }

	/// <summary>
	/// Number of listings created today.
	/// </summary>
	public int TodayListings { get; set; }

	/// <summary>
	/// Number of users registered today.
	/// </summary>
	public int TodayUsers { get; set; }

	/// <summary>
	/// Number of active (published) listings.
	/// </summary>
	public int ActiveListings { get; set; }

	/// <summary>
	/// Number of rejected listings.
	/// </summary>
	public int RejectedListings { get; set; }

	/// <summary>
	/// Number of expired listings.
	/// </summary>
	public int ExpiredListings { get; set; }

	/// <summary>
	/// Total number of questions on listings.
	/// </summary>
	public int TotalQuestions { get; set; }

	/// <summary>
	/// Total number of favorites (bookmarks) across listings.
	/// </summary>
	public int TotalFavorites { get; set; }
}
