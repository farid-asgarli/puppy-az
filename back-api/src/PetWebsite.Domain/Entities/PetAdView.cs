using PetWebsite.Domain.Common;

namespace PetWebsite.Domain.Entities;

/// <summary>
/// Represents a user's view of a pet advertisement for tracking recently viewed ads.
/// </summary>
public class PetAdView : BaseEntity<int>
{
	/// <summary>
	/// Gets or sets the ID of the user who viewed the ad.
	/// </summary>
	public Guid UserId { get; set; }

	/// <summary>
	/// Gets or sets the ID of the pet ad that was viewed.
	/// </summary>
	public int PetAdId { get; set; }

	/// <summary>
	/// Gets or sets the date and time when the ad was viewed.
	/// </summary>
	public DateTime ViewedAt { get; set; }

	// Navigation properties
	/// <summary>
	/// Gets or sets the user who viewed the ad.
	/// </summary>
	public User User { get; set; } = null!;

	/// <summary>
	/// Gets or sets the pet ad that was viewed.
	/// </summary>
	public PetAd PetAd { get; set; } = null!;
}
