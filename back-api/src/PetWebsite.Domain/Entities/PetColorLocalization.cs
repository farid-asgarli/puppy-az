using PetWebsite.Domain.Common;

namespace PetWebsite.Domain.Entities;

/// <summary>
/// Represents localized content for a pet color.
/// </summary>
public class PetColorLocalization : Localization
{
	/// <summary>
	/// Gets or sets the pet color ID.
	/// </summary>
	public int PetColorId { get; set; }

	/// <summary>
	/// Gets or sets the localized title (e.g., "Qara", "Black", "Чёрный").
	/// </summary>
	public string Title { get; set; } = string.Empty;

	/// <summary>
	/// Navigation property to the pet color.
	/// </summary>
	public PetColor PetColor { get; set; } = null!;
}
