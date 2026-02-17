using PetWebsite.Domain.Common;

namespace PetWebsite.Domain.Entities;

/// <summary>
/// Represents localized content for a pet advertisement type.
/// </summary>
public class PetAdTypeLocalization : Localization
{
	/// <summary>
	/// Gets or sets the pet ad type ID.
	/// </summary>
	public int PetAdTypeId { get; set; }

	/// <summary>
	/// Gets or sets the localized title (e.g., "Satış", "For Sale", "Продажа").
	/// </summary>
	public string Title { get; set; } = string.Empty;

	/// <summary>
	/// Gets or sets the localized description.
	/// </summary>
	public string? Description { get; set; }

	/// <summary>
	/// Navigation property to the pet ad type.
	/// </summary>
	public PetAdTypeEntity PetAdType { get; set; } = null!;
}
