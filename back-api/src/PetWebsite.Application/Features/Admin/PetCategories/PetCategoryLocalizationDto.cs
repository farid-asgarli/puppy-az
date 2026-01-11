namespace PetWebsite.Application.Features.Admin.PetCategories;

public class PetCategoryLocalizationDto
{
	public int Id { get; init; }
	public int PetCategoryId { get; init; }
	public string LocaleCode { get; init; } = string.Empty;
	public string Title { get; init; } = string.Empty;
	public string Subtitle { get; init; } = string.Empty;
}
