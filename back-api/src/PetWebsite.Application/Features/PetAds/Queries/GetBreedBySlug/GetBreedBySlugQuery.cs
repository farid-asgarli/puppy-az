using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.PetAds.Queries.GetBreedBySlug;

public record GetBreedBySlugQuery(string CategorySlug, string BreedSlug) : IQuery<Result<PetBreedWithCategoryDto>>;

public class PetBreedWithCategoryDto
{
	public int Id { get; init; }
	public string Title { get; init; } = string.Empty;
	public string Slug { get; init; } = string.Empty;
	public int CategoryId { get; init; }
	public string CategoryTitle { get; init; } = string.Empty;
	public string CategorySlug { get; init; } = string.Empty;
}
