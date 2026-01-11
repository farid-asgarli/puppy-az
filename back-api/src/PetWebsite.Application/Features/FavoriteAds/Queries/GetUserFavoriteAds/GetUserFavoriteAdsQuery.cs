using Common.Repository.Filtering;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Application.Features.PetAds;

namespace PetWebsite.Application.Features.FavoriteAds.Queries.GetUserFavoriteAds;

public record GetUserFavoriteAdsQuery(PaginationSpecification Pagination) : IQuery<Result<PaginatedResult<PetAdListItemDto>>>;
