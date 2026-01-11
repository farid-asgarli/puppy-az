using Common.Repository.Filtering;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.PetAds.Queries.GetRelatedPetAds;

public record GetRelatedPetAdsQuery(int PetAdId, QuerySpecification Specification) : IQuery<Result<PaginatedResult<PetAdListItemDto>>>;
