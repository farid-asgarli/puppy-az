using PetWebsite.Domain.Common;

namespace PetWebsite.Domain.Entities;

/// <summary>
/// Represents a supported application locale/language.
/// </summary>
public class AppLocale : BaseEntity
{
	/// <summary>
	/// Gets or sets the locale code (e.g., "en", "ru", "az").
	/// </summary>
	public string Code { get; set; } = string.Empty;

	/// <summary>
	/// Gets or sets the display name of the locale (e.g., "English", "Русский", "Azərbaycan").
	/// </summary>
	public string Name { get; set; } = string.Empty;

	/// <summary>
	/// Gets or sets the display name in the native language.
	/// </summary>
	public string NativeName { get; set; } = string.Empty;

	/// <summary>
	/// Gets or sets whether this locale is active and available for use.
	/// </summary>
	public bool IsActive { get; set; } = true;

	/// <summary>
	/// Gets or sets whether this is the default locale.
	/// </summary>
	public bool IsDefault { get; set; }
}
