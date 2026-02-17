using Common.Repository.Filtering;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Application.Features.PetAds;

namespace PetWebsite.Application.Features.Admin.PetAds.Queries.SearchPetAds;

/// <summary>
/// Query to search pet advertisements for admin panel (no status restrictions).
/// </summary>
public class AdminSearchPetAdsQuery : QuerySpecification, IQuery<Result<PaginatedResult<MyPetAdListItemDto>>>;
