using PetWebsite.Domain.Common;

namespace PetWebsite.Domain.Entities;

/// <summary>
/// Represents localized content for a static section.
/// </summary>
public class StaticSectionLocalization : Localization
{
	/// <summary>
	/// Gets or sets the static section ID.
	/// </summary>
	public int StaticSectionId { get; set; }

	/// <summary>
	/// Gets or sets the localized title.
	/// </summary>
	public string Title { get; set; } = string.Empty;

	/// <summary>
	/// Gets or sets the localized subtitle.
	/// </summary>
	public string Subtitle { get; set; } = string.Empty;

	/// <summary>
	/// Gets or sets the localized content (main body text).
	/// </summary>
	public string Content { get; set; } = string.Empty;

	/// <summary>
	/// Gets or sets additional localized metadata as JSON.
	/// </summary>
	public string? Metadata { get; set; }

	/// <summary>
	/// Navigation property to the static section.
	/// </summary>
	public StaticSection StaticSection { get; set; } = null!;
}
