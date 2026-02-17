namespace PetWebsite.Application.Features.Admin.StaticSections;

/// <summary>
/// DTO for static section localization.
/// </summary>
public class StaticSectionLocalizationDto
{
	public int Id { get; set; }
	public string LocaleCode { get; set; } = string.Empty;
	public string Title { get; set; } = string.Empty;
	public string Subtitle { get; set; } = string.Empty;
	public string Content { get; set; } = string.Empty;
	public string? Metadata { get; set; }
}
