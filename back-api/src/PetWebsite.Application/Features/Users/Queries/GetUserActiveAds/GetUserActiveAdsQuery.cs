using Common.Repository.Filtering;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Application.Features.PetAds;

namespace PetWebsite.Application.Features.Users.Queries.GetUserActiveAds;

/// <summary>
/// Query to get a paginated list of the current user's active (published) pet advertisements.
/// </summary>
public class GetUserActiveAdsQuery : QuerySpecification, IQuery<Result<PaginatedResult<MyPetAdListItemDto>>>;
