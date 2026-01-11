using Common.Repository.Filtering;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.PetAds.Queries.GetMyAdsQuestions;

/// <summary>
/// Query to get all questions on ads owned by the authenticated user.
/// </summary>
public class GetMyAdsQuestionsQuery : QuerySpecification, IQuery<Result<PaginatedResult<MyAdQuestionDto>>>;
