namespace PetWebsite.Application.Features.Public.Statistics.Queries.GetPublicStats;

/// <summary>
/// DTO representing public statistics.
/// </summary>
public class PublicStatsDto
{
	/// <summary>
	/// Number of active (published) ads.
	/// </summary>
	public int ActiveAds { get; set; }

	/// <summary>
	/// Total number of registered users.
	/// </summary>
	public int TotalUsers { get; set; }
}
