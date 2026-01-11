using PetWebsite.Domain.Common;
using PetWebsite.Domain.Enums;

namespace PetWebsite.Domain.Entities;

/// <summary>
/// Represents a pet advertisement.
/// </summary>
public class PetAd : SoftDeletableEntity
{
	/// <summary>
	/// Gets or sets the ad title.
	/// </summary>
	public string Title { get; set; } = string.Empty;

	/// <summary>
	/// Gets or sets the ad description.
	/// </summary>
	public string Description { get; set; } = string.Empty;

	/// <summary>
	/// Gets or sets the pet's age in months.
	/// </summary>
	public int AgeInMonths { get; set; }

	/// <summary>
	/// Gets or sets the pet's gender.
	/// </summary>
	public PetGender Gender { get; set; }

	/// <summary>
	/// Gets or sets the type of advertisement.
	/// </summary>
	public PetAdType AdType { get; set; }

	/// <summary>
	/// Gets or sets the pet's primary color.
	/// </summary>
	public string Color { get; set; } = string.Empty;

	/// <summary>
	/// Gets or sets the pet's weight in kilograms.
	/// </summary>
	public decimal? Weight { get; set; }

	/// <summary>
	/// Gets or sets the pet's size category.
	/// </summary>
	public PetSize? Size { get; set; }

	/// <summary>
	/// Gets or sets the price in the local currency.
	/// </summary>
	public decimal? Price { get; set; }

	/// <summary>
	/// Gets or sets the city ID where the pet is located.
	/// </summary>
	public int CityId { get; set; }

	/// <summary>
	/// Gets or sets the status of the advertisement.
	/// </summary>
	public PetAdStatus Status { get; set; } = PetAdStatus.Pending;

	/// <summary>
	/// Gets or sets the reason for rejection if the ad was rejected.
	/// </summary>
	public string? RejectionReason { get; set; }

	/// <summary>
	/// Gets or sets whether the pet is still available.
	/// </summary>
	public bool IsAvailable { get; set; } = true;

	/// <summary>
	/// Gets or sets whether this is a premium/featured ad.
	/// </summary>
	public bool IsPremium { get; set; }

	/// <summary>
	/// Gets or sets when the premium status was activated.
	/// </summary>
	public DateTime? PremiumActivatedAt { get; set; }

	/// <summary>
	/// Gets or sets when the premium status expires.
	/// </summary>
	public DateTime? PremiumExpiresAt { get; set; }

	/// <summary>
	/// Gets or sets the number of views this ad has received.
	/// </summary>
	public int ViewCount { get; set; }

	/// <summary>
	/// Gets or sets when the ad was published.
	/// </summary>
	public DateTime? PublishedAt { get; set; }

	/// <summary>
	/// Gets or sets when the ad expires/will be archived.
	/// </summary>
	public DateTime? ExpiresAt { get; set; }

	/// <summary>
	/// Gets or sets the breed ID this ad belongs to.
	/// </summary>
	public int PetBreedId { get; set; }

	/// <summary>
	/// Navigation property to the breed.
	/// </summary>
	public PetBreed Breed { get; set; } = null!;

	/// <summary>
	/// Gets or sets the user ID who created this ad.
	/// </summary>
	public Guid? UserId { get; set; }

	/// <summary>
	/// Navigation property to the user who created this ad.
	/// </summary>
	public User? User { get; set; }

	/// <summary>
	/// Navigation property to the city.
	/// </summary>
	public City City { get; set; } = null!;

	/// <summary>
	/// Navigation property for ad images.
	/// </summary>
	public ICollection<PetAdImage> Images { get; set; } = [];

	/// <summary>
	/// Navigation property for ad questions.
	/// </summary>
	public ICollection<PetAdQuestion> Questions { get; set; } = [];
}
