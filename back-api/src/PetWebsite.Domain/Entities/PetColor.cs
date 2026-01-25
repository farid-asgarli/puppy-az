using PetWebsite.Domain.Common;

namespace PetWebsite.Domain.Entities;

/// <summary>
/// Represents a pet color option for selection.
/// </summary>
public class PetColor : SoftDeletableEntity
{
	/// <summary>
	/// Gets or sets the color key (e.g., "black", "white", "brown").
	/// </summary>
	public string Key { get; set; } = string.Empty;

	/// <summary>
	/// Gets or sets the background color class (e.g., "bg-gray-200").
	/// </summary>
	public string BackgroundColor { get; set; } = string.Empty;

	/// <summary>
	/// Gets or sets the text color class (e.g., "text-gray-800").
	/// </summary>
	public string TextColor { get; set; } = string.Empty;

	/// <summary>
	/// Gets or sets the border color class (e.g., "border-gray-300").
	/// </summary>
	public string BorderColor { get; set; } = string.Empty;

	/// <summary>
	/// Gets or sets the sort order for display.
	/// </summary>
	public int SortOrder { get; set; }

	/// <summary>
	/// Gets or sets whether this color is active.
	/// </summary>
	public bool IsActive { get; set; } = true;

	/// <summary>
	/// Navigation property for localizations.
	/// </summary>
	public ICollection<PetColorLocalization> Localizations { get; set; } = [];
}
