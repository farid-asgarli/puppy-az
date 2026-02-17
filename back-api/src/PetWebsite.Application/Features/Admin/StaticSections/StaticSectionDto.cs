namespace PetWebsite.Application.Features.Admin.StaticSections;

/// <summary>
/// DTO for static section details.
/// </summary>
public class StaticSectionDto
{
	public int Id { get; set; }
	public string Key { get; set; } = string.Empty;
	public bool IsActive { get; set; }
	public DateTime CreatedAt { get; set; }
	public DateTime? UpdatedAt { get; set; }
	public List<StaticSectionLocalizationDto> Localizations { get; set; } = [];
}

/// <summary>
/// DTO for static section list item.
/// </summary>
public class StaticSectionListItemDto
{
	public int Id { get; set; }
	public string Key { get; set; } = string.Empty;
	public bool IsActive { get; set; }
	public DateTime CreatedAt { get; set; }
	public DateTime? UpdatedAt { get; set; }
	public string TitleAz { get; set; } = string.Empty;
	public string TitleEn { get; set; } = string.Empty;
	public string TitleRu { get; set; } = string.Empty;
}
