namespace PetWebsite.Application.Features.Admin.Dashboard.Queries.GetChartStats;

/// <summary>
/// DTO representing comprehensive chart statistics for admin dashboard.
/// </summary>
public class ChartStatsDto
{
	/// <summary>
	/// Listings count by month/year for trend chart.
	/// </summary>
	public List<TimeSeriesDataPoint> ListingsTrend { get; set; } = [];

	/// <summary>
	/// Users registration by month/year for trend chart.
	/// </summary>
	public List<TimeSeriesDataPoint> UsersTrend { get; set; } = [];

	/// <summary>
	/// Top categories by listing count.
	/// </summary>
	public List<RankingItem> TopCategories { get; set; } = [];

	/// <summary>
	/// Bottom categories by listing count.
	/// </summary>
	public List<RankingItem> BottomCategories { get; set; } = [];

	/// <summary>
	/// Top breeds by listing count.
	/// </summary>
	public List<RankingItem> TopBreeds { get; set; } = [];

	/// <summary>
	/// Bottom breeds by listing count.
	/// </summary>
	public List<RankingItem> BottomBreeds { get; set; } = [];

	/// <summary>
	/// Top cities by listing count.
	/// </summary>
	public List<RankingItem> TopCities { get; set; } = [];

	/// <summary>
	/// Bottom cities by listing count.
	/// </summary>
	public List<RankingItem> BottomCities { get; set; } = [];

	/// <summary>
	/// Distribution by listing type (Sale, Match, Lost, Found, Owning).
	/// </summary>
	public List<DistributionItem> ListingTypeDistribution { get; set; } = [];

	/// <summary>
	/// Distribution by gender (Male, Female).
	/// </summary>
	public List<DistributionItem> GenderDistribution { get; set; } = [];

	/// <summary>
	/// Distribution by pet size.
	/// </summary>
	public List<DistributionItem> SizeDistribution { get; set; } = [];

	/// <summary>
	/// Distribution by status (Active, Pending, Rejected, Expired).
	/// </summary>
	public List<DistributionItem> StatusDistribution { get; set; } = [];

	/// <summary>
	/// Distribution by membership (Standard, Premium).
	/// </summary>
	public List<DistributionItem> MembershipDistribution { get; set; } = [];

	/// <summary>
	/// Top users by listings count.
	/// </summary>
	public List<UserRankingItem> TopUsers { get; set; } = [];

	/// <summary>
	/// Views trend by month/year.
	/// </summary>
	public List<TimeSeriesDataPoint> ViewsTrend { get; set; } = [];

	/// <summary>
	/// Average price by category.
	/// </summary>
	public List<RankingItem> AveragePriceByCategory { get; set; } = [];

	/// <summary>
	/// Listings by day of week.
	/// </summary>
	public List<DistributionItem> ListingsByDayOfWeek { get; set; } = [];
}

/// <summary>
/// Time series data point for trend charts.
/// </summary>
public class TimeSeriesDataPoint
{
	public string Label { get; set; } = string.Empty;
	public int Value { get; set; }
	public string Period { get; set; } = string.Empty;
}

/// <summary>
/// Ranking item for top/bottom lists.
/// </summary>
public class RankingItem
{
	public int Id { get; set; }
	public string Name { get; set; } = string.Empty;
	public int Count { get; set; }
	public decimal? AverageValue { get; set; }
	public double Percentage { get; set; }
}

/// <summary>
/// Distribution item for pie/donut charts.
/// </summary>
public class DistributionItem
{
	public string Name { get; set; } = string.Empty;
	public string Key { get; set; } = string.Empty;
	public int Count { get; set; }
	public double Percentage { get; set; }
	public string Color { get; set; } = string.Empty;
}

/// <summary>
/// User ranking item with additional user info.
/// </summary>
public class UserRankingItem
{
	public Guid UserId { get; set; }
	public string FullName { get; set; } = string.Empty;
	public string Phone { get; set; } = string.Empty;
	public int ListingsCount { get; set; }
	public int TotalViews { get; set; }
	public DateTime JoinedAt { get; set; }
}
