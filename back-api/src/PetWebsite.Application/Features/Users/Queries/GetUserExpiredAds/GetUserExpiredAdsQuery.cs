using Common.Repository.Filtering;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Application.Features.PetAds;

namespace PetWebsite.Application.Features.Users.Queries.GetUserExpiredAds;

/// <summary>
/// Query to get a paginated list of the current user's expired pet advertisements.
/// Expired ads can be reactivated by the user.
/// </summary>
public class GetUserExpiredAdsQuery : QuerySpecification, IQuery<Result<PaginatedResult<MyPetAdListItemDto>>>;
