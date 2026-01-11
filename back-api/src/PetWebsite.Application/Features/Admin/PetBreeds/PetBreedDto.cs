namespace PetWebsite.Application.Features.Admin.PetBreeds;

public class PetBreedDto
{
	public int Id { get; init; }
	public string Title { get; init; } = string.Empty;
	public List<PetBreedLocalizationDto> Localizations { get; init; } = [];
	public bool IsActive { get; init; }
	public bool IsDeleted { get; init; }
	public int PetCategoryId { get; init; }
	public string CategoryTitle { get; init; } = string.Empty;
	public DateTime CreatedAt { get; init; }
	public DateTime? UpdatedAt { get; init; }
	public DateTime? DeletedAt { get; init; }
}

public class PetBreedListItemDto
{
	public int Id { get; init; }
	public string Title { get; init; } = string.Empty;
	public bool IsActive { get; init; }
	public bool IsDeleted { get; init; }
	public int PetCategoryId { get; init; }
	public string CategoryTitle { get; init; } = string.Empty;
	public int PetAdsCount { get; init; }
	public DateTime CreatedAt { get; init; }
}
