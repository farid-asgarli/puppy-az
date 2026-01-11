using PetWebsite.Domain.Common;

namespace PetWebsite.Domain.Entities;

/// <summary>
/// Represents a city where pets can be located.
/// </summary>
public class City : SoftDeletableEntity
{
	/// <summary>
	/// Gets or sets the name of the city.
	/// </summary>
	public string Name { get; set; } = string.Empty;

	/// <summary>
	/// Gets or sets whether this city is active.
	/// </summary>
	public bool IsActive { get; set; } = true;

	/// <summary>
	/// Navigation property for pet ads in this city.
	/// </summary>
	public ICollection<PetAd> PetAds { get; set; } = [];
}
