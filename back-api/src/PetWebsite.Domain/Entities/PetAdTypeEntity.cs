using PetWebsite.Domain.Common;

namespace PetWebsite.Domain.Entities;

/// <summary>
/// Represents a pet advertisement type (Sale, Match, Found, Lost, Owning).
/// </summary>
public class PetAdTypeEntity : SoftDeletableEntity
{
	/// <summary>
	/// Gets or sets the type key (e.g., "sale", "match", "found").
	/// </summary>
	public string Key { get; set; } = string.Empty;

	/// <summary>
	/// Gets or sets the emoji for visual representation.
	/// </summary>
	public string Emoji { get; set; } = string.Empty;

	/// <summary>
	/// Gets or sets the icon name for UI display.
	/// </summary>
	public string? IconName { get; set; }

	/// <summary>
	/// Gets or sets the background color for UI styling.
	/// </summary>
	public string BackgroundColor { get; set; } = string.Empty;

	/// <summary>
	/// Gets or sets the text color for UI styling.
	/// </summary>
	public string TextColor { get; set; } = string.Empty;

	/// <summary>
	/// Gets or sets the border color for UI styling.
	/// </summary>
	public string BorderColor { get; set; } = string.Empty;

	/// <summary>
	/// Gets or sets the sort order for display.
	/// </summary>
	public int SortOrder { get; set; }

	/// <summary>
	/// Gets or sets whether this type is active.
	/// </summary>
	public bool IsActive { get; set; } = true;

	/// <summary>
	/// Navigation property for localizations.
	/// </summary>
	public ICollection<PetAdTypeLocalization> Localizations { get; set; } = [];
}
