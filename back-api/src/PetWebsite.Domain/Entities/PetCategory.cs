using PetWebsite.Domain.Common;

namespace PetWebsite.Domain.Entities;

/// <summary>
/// Represents a pet category (e.g., Dog, Cat, Bird, Fish, Reptile, Insect, Farm Animal, Rodent, Wild Animal, Other).
/// </summary>
public class PetCategory : SoftDeletableEntity, ILocalizedEntity<PetCategoryLocalization>
{
	/// <summary>
	/// Gets or sets the SVG icon content for the category.
	/// </summary>
	public string SvgIcon { get; set; } = string.Empty;

	/// <summary>
	/// Gets or sets the icon color class (e.g., "text-amber-600").
	/// </summary>
	public string IconColor { get; set; } = string.Empty;

	/// <summary>
	/// Gets or sets the background color class (e.g., "bg-purple-50").
	/// </summary>
	public string BackgroundColor { get; set; } = string.Empty;

	/// <summary>
	/// Gets or sets whether this category is active.
	/// </summary>
	public bool IsActive { get; set; } = true;

	/// <summary>
	/// Navigation property for localizations.
	/// </summary>
	public ICollection<PetCategoryLocalization> Localizations { get; set; } = [];

	/// <summary>
	/// Navigation property for breeds belonging to this category.
	/// </summary>
	public ICollection<PetBreed> Breeds { get; set; } = [];
}
