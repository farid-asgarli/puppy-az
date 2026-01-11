using Common.Repository.Filtering;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Application.Features.PetAds;

namespace PetWebsite.Application.Features.Users.Queries.GetUserAds;

/// <summary>
/// Query to get a paginated list of all the current user's pet advertisements (all statuses).
/// </summary>
public class GetUserAdsQuery : QuerySpecification, IQuery<Result<PaginatedResult<MyPetAdListItemDto>>>;
