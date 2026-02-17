using Common.Repository.Filtering;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Admin.BreedSuggestions.Queries.ListBreedSuggestions;

public class ListBreedSuggestionsQuery : QuerySpecification, ICommand<PaginatedResult<BreedSuggestionListItemDto>>
{
	public int? PetCategoryId { get; init; }
	public int? Status { get; init; }
}
