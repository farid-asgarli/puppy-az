namespace PetWebsite.Application.Features.Admin.Districts;

public class DistrictDto
{
	public int Id { get; init; }
	public string NameAz { get; init; } = string.Empty;
	public string NameEn { get; init; } = string.Empty;
	public string NameRu { get; init; } = string.Empty;
	public int CityId { get; init; }
	public string CityNameAz { get; init; } = string.Empty;
	public int DisplayOrder { get; init; }
	public bool IsActive { get; init; }
	public bool IsDeleted { get; init; }
	public DateTime CreatedAt { get; init; }
	public DateTime? UpdatedAt { get; init; }
	public DateTime? DeletedAt { get; init; }
}

public class DistrictListItemDto
{
	public int Id { get; init; }
	public string NameAz { get; init; } = string.Empty;
	public string NameEn { get; init; } = string.Empty;
	public string NameRu { get; init; } = string.Empty;
	public int CityId { get; init; }
	public string CityNameAz { get; init; } = string.Empty;
	public int DisplayOrder { get; init; }
	public bool IsActive { get; init; }
	public bool IsDeleted { get; init; }
	public int PetAdsCount { get; init; }
	public DateTime CreatedAt { get; init; }
}
