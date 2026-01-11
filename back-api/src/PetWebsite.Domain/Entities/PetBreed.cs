using PetWebsite.Domain.Common;

namespace PetWebsite.Domain.Entities;

/// <summary>
/// Represents a pet breed (e.g., French Lop, Golden Retriever).
/// </summary>
public class PetBreed : SoftDeletableEntity, ILocalizedEntity<PetBreedLocalization>
{
	/// <summary>
	/// Gets or sets whether this breed is active.
	/// </summary>
	public bool IsActive { get; set; } = true;

	/// <summary>
	/// Gets or sets the category ID this breed belongs to.
	/// </summary>
	public int PetCategoryId { get; set; }

	/// <summary>
	/// Navigation property for localizations.
	/// </summary>
	public ICollection<PetBreedLocalization> Localizations { get; set; } = [];

	/// <summary>
	/// Navigation property to the parent category.
	/// </summary>
	public PetCategory Category { get; set; } = null!;

	/// <summary>
	/// Navigation property for ads belonging to this breed.
	/// </summary>
	public ICollection<PetAd> PetAds { get; set; } = [];
}
