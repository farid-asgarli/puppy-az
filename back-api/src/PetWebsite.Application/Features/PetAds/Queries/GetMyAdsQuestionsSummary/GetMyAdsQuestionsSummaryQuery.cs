using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.PetAds.Queries.GetMyAdsQuestionsSummary;

/// <summary>
/// Query to get a summary of questions on ads owned by the authenticated user.
/// </summary>
public record GetMyAdsQuestionsSummaryQuery : IQuery<Result<MyAdsQuestionsSummaryDto>>;
