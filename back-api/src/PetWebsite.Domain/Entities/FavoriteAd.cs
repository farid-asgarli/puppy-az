namespace PetWebsite.Domain.Entities;

/// <summary>
/// Represents a user's favorite pet advertisement (many-to-many relationship).
/// </summary>
public class FavoriteAd
{
	/// <summary>
	/// Gets or sets the ID of the user who favorited the ad.
	/// </summary>
	public Guid UserId { get; set; }

	/// <summary>
	/// Gets or sets the ID of the favorited pet ad.
	/// </summary>
	public int PetAdId { get; set; }

	/// <summary>
	/// Gets or sets when the ad was added to favorites.
	/// </summary>
	public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

	/// <summary>
	/// Navigation property to the user.
	/// </summary>
	public User User { get; set; } = null!;

	/// <summary>
	/// Navigation property to the pet ad.
	/// </summary>
	public PetAd PetAd { get; set; } = null!;
}
