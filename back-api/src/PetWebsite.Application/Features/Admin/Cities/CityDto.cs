namespace PetWebsite.Application.Features.Admin.Cities;

public class CityDto
{
	public int Id { get; init; }
	public string Name { get; init; } = string.Empty;
	public bool IsActive { get; init; }
	public bool IsDeleted { get; init; }
	public DateTime CreatedAt { get; init; }
	public DateTime? UpdatedAt { get; init; }
	public DateTime? DeletedAt { get; init; }
}

public class CityListItemDto
{
	public int Id { get; init; }
	public string Name { get; init; } = string.Empty;
	public bool IsActive { get; init; }
	public bool IsDeleted { get; init; }
	public int PetAdsCount { get; init; }
	public DateTime CreatedAt { get; init; }
}
