using Common.Repository.Filtering;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.PetAds.Queries.GetRecentlyViewedPetAds;

/// <summary>
/// Query to get a paginated list of recently viewed pet advertisements for the authenticated user.
/// </summary>
public class GetRecentlyViewedPetAdsQuery : QuerySpecification, IQuery<Result<PaginatedResult<PetAdListItemDto>>>;
