using Common.Repository.Filtering;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Application.Features.PetAds;

namespace PetWebsite.Application.Features.Users.Queries.GetUserPendingAds;

/// <summary>
/// Query to get a paginated list of the current user's pending pet advertisements.
/// </summary>
public class GetUserPendingAdsQuery : QuerySpecification, IQuery<Result<PaginatedResult<MyPetAdListItemDto>>>;
