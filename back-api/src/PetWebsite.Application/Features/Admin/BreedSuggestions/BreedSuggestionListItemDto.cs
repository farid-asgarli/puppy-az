using PetWebsite.Domain.Entities;

namespace PetWebsite.Application.Features.Admin.BreedSuggestions;

public class BreedSuggestionListItemDto
{
	public int Id { get; set; }
	public string Name { get; set; } = string.Empty;
	public int PetCategoryId { get; set; }
	public string CategoryTitle { get; set; } = string.Empty;
	public Guid? UserId { get; set; }
	public string? UserName { get; set; }
	public BreedSuggestionStatus Status { get; set; }
	public int? ApprovedBreedId { get; set; }
	public string? AdminNote { get; set; }
	public DateTime CreatedAt { get; set; }
}
