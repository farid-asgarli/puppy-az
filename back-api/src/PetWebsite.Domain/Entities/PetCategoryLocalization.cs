using PetWebsite.Domain.Common;

namespace PetWebsite.Domain.Entities;

/// <summary>
/// Represents localized content for a pet category.
/// </summary>
public class PetCategoryLocalization : Localization
{
	/// <summary>
	/// Gets or sets the pet category ID.
	/// </summary>
	public int PetCategoryId { get; set; }

	/// <summary>
	/// Gets or sets the localized title.
	/// </summary>
	public string Title { get; set; } = string.Empty;

	/// <summary>
	/// Gets or sets the localized subtitle.
	/// </summary>
	public string Subtitle { get; set; } = string.Empty;

	/// <summary>
	/// Navigation property to the pet category.
	/// </summary>
	public PetCategory PetCategory { get; set; } = null!;
}
