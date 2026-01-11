namespace PetWebsite.Application.Features.Admin.PetBreeds;

public class PetBreedLocalizationDto
{
	public int Id { get; init; }
	public int PetBreedId { get; init; }
	public string LocaleCode { get; init; } = string.Empty;
	public string Title { get; init; } = string.Empty;
}
