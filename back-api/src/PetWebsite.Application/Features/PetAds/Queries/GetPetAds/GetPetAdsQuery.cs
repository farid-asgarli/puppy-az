using Common.Repository.Filtering;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.PetAds.Queries.GetPetAds;

/// <summary>
/// Query to get a paginated and filtered list of pet advertisements.
/// </summary>
public class GetPetAdsQuery : QuerySpecification, IQuery<Result<PaginatedResult<PetAdListItemDto>>>;
