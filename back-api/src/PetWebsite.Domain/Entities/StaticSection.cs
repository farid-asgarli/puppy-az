using PetWebsite.Domain.Common;

namespace PetWebsite.Domain.Entities;

/// <summary>
/// Represents a static content section (e.g., Hero, How it works, About, Contact, etc.).
/// </summary>
public class StaticSection : AuditableEntity, ILocalizedEntity<StaticSectionLocalization>
{
	/// <summary>
	/// Gets or sets the unique key for this section (e.g., "home_hero", "about", "contact").
	/// </summary>
	public string Key { get; set; } = string.Empty;

	/// <summary>
	/// Gets or sets whether this section is active.
	/// </summary>
	public bool IsActive { get; set; } = true;

	/// <summary>
	/// Navigation property for localizations.
	/// </summary>
	public ICollection<StaticSectionLocalization> Localizations { get; set; } = [];
}
