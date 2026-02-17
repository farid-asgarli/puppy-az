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
	/// Optional for Found and Owning ad types.
	/// </summary>
	public int? AgeInMonths { get; set; }

	/// <summary>
	/// Gets or sets the pet's gender.
	/// Optional for Found and Owning ad types.
	/// </summary>
	public PetGender? Gender { get; set; }

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
	/// Gets or sets the price in the local currency (optional).
	/// </summary>
	public decimal? Price { get; set; }

	/// <summary>
	/// Gets or sets the city ID where the pet is located.
	/// </summary>
	public int CityId { get; set; }

	/// <summary>
	/// Gets or sets the district ID within the city (optional).
	/// Used for detailed location tracking (village, settlement, etc.)
	/// </summary>
	public int? DistrictId { get; set; }

	/// <summary>
	/// Gets or sets a user-suggested district name when no existing district matches.
	/// Similar to SuggestedBreedName - allows users to suggest a new district.
	/// </summary>
	public string? CustomDistrictName { get; set; }

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
	/// Premium ads appear at the top across ALL categories and within their own category.
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
	/// Gets or sets whether this is a VIP ad.
	/// VIP ads appear at the top only within their OWN category.
	/// </summary>
	public bool IsVip { get; set; }

	/// <summary>
	/// Gets or sets when the VIP status was activated.
	/// </summary>
	public DateTime? VipActivatedAt { get; set; }

	/// <summary>
	/// Gets or sets when the VIP status expires.
	/// </summary>
	public DateTime? VipExpiresAt { get; set; }

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
	/// Optional for Found and Owning ad types.
	/// </summary>
	public int? PetBreedId { get; set; }

	/// <summary>
	/// Gets or sets a user-suggested breed name when no existing breed matches.
	/// This is used when a user suggests a new breed that doesn't exist in the system yet.
	/// </summary>
	public string? SuggestedBreedName { get; set; }

	/// <summary>
	/// Navigation property to the breed.
	/// </summary>
	public PetBreed? Breed { get; set; }

	/// <summary>
	/// Gets or sets the pet category ID.
	/// This allows storing category even when breed is not selected (e.g., Found/Owning ad types).
	/// </summary>
	public int? PetCategoryId { get; set; }

	/// <summary>
	/// Navigation property to the category.
	/// </summary>
	public PetCategory? Category { get; set; }

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
	/// Navigation property to the district (optional).
	/// </summary>
	public District? District { get; set; }

	/// <summary>
	/// Navigation property for ad images.
	/// </summary>
	public ICollection<PetAdImage> Images { get; set; } = [];

	/// <summary>
	/// Navigation property for ad questions.
	/// </summary>
	public ICollection<PetAdQuestion> Questions { get; set; } = [];
}
