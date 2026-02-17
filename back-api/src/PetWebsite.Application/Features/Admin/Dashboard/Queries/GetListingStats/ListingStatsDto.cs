namespace PetWebsite.Application.Features.Admin.Dashboard.Queries.GetListingStats;

/// <summary>
/// DTO representing admin listing statistics by status.
/// </summary>
public class ListingStatsDto
{
	/// <summary>
	/// Total number of listings.
	/// </summary>
	public int Total { get; set; }

	/// <summary>
	/// Number of active (published) listings.
	/// </summary>
	public int Active { get; set; }

	/// <summary>
	/// Number of pending listings.
	/// </summary>
	public int Pending { get; set; }

	/// <summary>
	/// Number of rejected listings.
	/// </summary>
	public int Rejected { get; set; }

	/// <summary>
	/// Number of expired listings.
	/// </summary>
	public int Expired { get; set; }
}
