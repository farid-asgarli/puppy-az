using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.PetAds.Queries.GetPetAdTypes;

/// <summary>
/// Query to get all active pet ad types for public use.
/// </summary>
public record GetPetAdTypesQuery : IQuery<Result<List<PetAdTypePublicDto>>>;

/// <summary>
/// Public DTO for pet ad type with localized content.
/// </summary>
public class PetAdTypePublicDto
{
	public int Id { get; init; }
	public string Key { get; init; } = string.Empty;
	public string Title { get; init; } = string.Empty;
	public string? Description { get; init; }
	public string Emoji { get; init; } = string.Empty;
	public string BackgroundColor { get; init; } = string.Empty;
	public string TextColor { get; init; } = string.Empty;
	public string BorderColor { get; init; } = string.Empty;
}
