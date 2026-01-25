using PetWebsite.Domain.Common;

namespace PetWebsite.Domain.Entities;

/// <summary>
/// Represents a city or district where pets can be located.
/// </summary>
public class City : SoftDeletableEntity
{
	/// <summary>
	/// Gets or sets the name of the city in Azerbaijani.
	/// </summary>
	public string NameAz { get; set; } = string.Empty;

	/// <summary>
	/// Gets or sets the name of the city in English.
	/// </summary>
	public string NameEn { get; set; } = string.Empty;

	/// <summary>
	/// Gets or sets the name of the city in Russian.
	/// </summary>
	public string NameRu { get; set; } = string.Empty;

	/// <summary>
	/// Gets or sets the display order for sorting.
	/// </summary>
	public int DisplayOrder { get; set; }

	/// <summary>
	/// Gets or sets whether this is a major city (not a district).
	/// </summary>
	public bool IsMajorCity { get; set; }

	/// <summary>
	/// Gets or sets whether this city is active.
	/// </summary>
	public bool IsActive { get; set; } = true;

	/// <summary>
	/// Navigation property for pet ads in this city.
	/// </summary>
	public ICollection<PetAd> PetAds { get; set; } = [];
}
