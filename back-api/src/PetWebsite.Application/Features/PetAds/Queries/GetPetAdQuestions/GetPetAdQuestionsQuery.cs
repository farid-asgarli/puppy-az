using Common.Repository.Filtering;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.PetAds.Queries.GetPetAdQuestions;

/// <summary>
/// Query to get all questions and answers for a specific pet advertisement.
/// </summary>
public record GetPetAdQuestionsQuery : IQuery<Result<PaginatedResult<PetAdQuestionDto>>>
{
	public int PetAdId { get; init; }
	public PaginationSpecification? Pagination { get; init; }
}
