namespace PetWebsite.Application.Features.PetAds.Queries.GetPetColors;

/// <summary>
/// DTO for pet color with localized title and styling information.
/// </summary>
public class PetColorDto
{
	public int Id { get; init; }
	public string Key { get; init; } = string.Empty;
	public string Title { get; init; } = string.Empty;
	public string BackgroundColor { get; init; } = string.Empty;
	public string TextColor { get; init; } = string.Empty;
	public string BorderColor { get; init; } = string.Empty;
}
