namespace PetWebsite.Application.Features.Cities;

public class CityDto
{
	public int Id { get; init; }
	public string Name { get; init; } = string.Empty;
	public bool IsMajorCity { get; init; }
	public int DisplayOrder { get; init; }
}
