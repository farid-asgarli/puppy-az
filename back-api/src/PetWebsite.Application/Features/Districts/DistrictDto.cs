namespace PetWebsite.Application.Features.Districts;

public class DistrictDto
{
	public int Id { get; init; }
	public string Name { get; init; } = string.Empty;
	public int CityId { get; init; }
}
