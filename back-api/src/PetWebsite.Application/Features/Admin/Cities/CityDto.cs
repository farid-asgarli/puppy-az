namespace PetWebsite.Application.Features.Admin.Cities;

public class CityDto
{
	public int Id { get; init; }
	public string NameAz { get; init; } = string.Empty;
	public string NameEn { get; init; } = string.Empty;
	public string NameRu { get; init; } = string.Empty;
	public bool IsMajorCity { get; init; }
	public int DisplayOrder { get; init; }
	public bool IsActive { get; init; }
	public bool IsDeleted { get; init; }
	public DateTime CreatedAt { get; init; }
	public DateTime? UpdatedAt { get; init; }
	public DateTime? DeletedAt { get; init; }
}

public class CityListItemDto
{
	public int Id { get; init; }
	public string NameAz { get; init; } = string.Empty;
	public string NameEn { get; init; } = string.Empty;
	public string NameRu { get; init; } = string.Empty;
	public bool IsMajorCity { get; init; }
	public int DisplayOrder { get; init; }
	public bool IsActive { get; init; }
	public bool IsDeleted { get; init; }
	public int PetAdsCount { get; init; }
	public DateTime CreatedAt { get; init; }
}
