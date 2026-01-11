namespace PetWebsite.Application.Features.Admin.PetCategories;

public class PetCategoryDto
{
	public int Id { get; init; }
	public string Title { get; init; } = string.Empty;
	public string Subtitle { get; init; } = string.Empty;
	public List<PetCategoryLocalizationDto> Localizations { get; init; } = [];
	public string SvgIcon { get; init; } = string.Empty;
	public string IconColor { get; init; } = string.Empty;
	public string BackgroundColor { get; init; } = string.Empty;
	public bool IsActive { get; init; }
	public bool IsDeleted { get; init; }
	public DateTime CreatedAt { get; init; }
	public DateTime? UpdatedAt { get; init; }
	public DateTime? DeletedAt { get; init; }
}

public class PetCategoryListItemDto
{
	public int Id { get; init; }
	public string Title { get; init; } = string.Empty;
	public string Subtitle { get; init; } = string.Empty;
	public string IconColor { get; init; } = string.Empty;
	public string BackgroundColor { get; init; } = string.Empty;
	public bool IsActive { get; init; }
	public bool IsDeleted { get; init; }
	public int BreedsCount { get; init; }
	public DateTime CreatedAt { get; init; }
}
