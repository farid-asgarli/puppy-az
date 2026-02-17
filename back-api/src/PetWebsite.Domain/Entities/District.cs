using PetWebsite.Domain.Common;

namespace PetWebsite.Domain.Entities;

/// <summary>
/// Represents a district/village/settlement within a city.
/// Used for detailed location tracking of pet ads.
/// </summary>
public class District : SoftDeletableEntity
{
	public string NameAz { get; set; } = string.Empty;
	public string NameEn { get; set; } = string.Empty;
	public string NameRu { get; set; } = string.Empty;
	public int DisplayOrder { get; set; }
	public bool IsActive { get; set; } = true;

	// Parent city relationship
	public int CityId { get; set; }
	public City City { get; set; } = null!;

	// Navigation property
	public ICollection<PetAd> PetAds { get; set; } = [];
}
