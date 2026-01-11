using Common.Repository.Filtering;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.PetAds.Queries.GetPremiumPetAds;

/// <summary>
/// Query to get a paginated and filtered list of premium pet advertisements.
/// </summary>
public class GetPremiumPetAdsQuery : QuerySpecification, IQuery<Result<PaginatedResult<PetAdListItemDto>>>;
