namespace PetWebsite.Application.Features.Admin.PetAdTypes;

public class PetAdTypeDto
{
	public int Id { get; init; }
	public string Key { get; init; } = string.Empty;
	public string Emoji { get; init; } = string.Empty;
	public string? IconName { get; init; }
	public string BackgroundColor { get; init; } = string.Empty;
	public string TextColor { get; init; } = string.Empty;
	public string BorderColor { get; init; } = string.Empty;
	public int SortOrder { get; init; }
	public bool IsActive { get; init; }
	public bool IsDeleted { get; init; }
	public string TitleAz { get; init; } = string.Empty;
	public string TitleEn { get; init; } = string.Empty;
	public string TitleRu { get; init; } = string.Empty;
	public string? DescriptionAz { get; init; }
	public string? DescriptionEn { get; init; }
	public string? DescriptionRu { get; init; }
	public DateTime CreatedAt { get; init; }
	public DateTime? UpdatedAt { get; init; }
	public DateTime? DeletedAt { get; init; }
}

public class PetAdTypeListItemDto
{
	public int Id { get; init; }
	public string Key { get; init; } = string.Empty;
	public string Emoji { get; init; } = string.Empty;
	public string? IconName { get; init; }
	public string BackgroundColor { get; init; } = string.Empty;
	public string TextColor { get; init; } = string.Empty;
	public string BorderColor { get; init; } = string.Empty;
	public int SortOrder { get; init; }
	public bool IsActive { get; init; }
	public bool IsDeleted { get; init; }
	public string TitleAz { get; init; } = string.Empty;
	public string TitleEn { get; init; } = string.Empty;
	public string TitleRu { get; init; } = string.Empty;
	public string? DescriptionAz { get; init; }
	public string? DescriptionEn { get; init; }
	public string? DescriptionRu { get; init; }
	public int PetAdsCount { get; init; }
	public DateTime CreatedAt { get; init; }
}
