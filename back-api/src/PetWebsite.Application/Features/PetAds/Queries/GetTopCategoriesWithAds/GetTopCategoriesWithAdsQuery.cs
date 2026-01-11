using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.PetAds.Queries.GetTopCategoriesWithAds;

/// <summary>
/// Query to get top 10 categories ordered by pet ads count (descending) with their published pet ads.
/// </summary>
public record GetTopCategoriesWithAdsQuery : IQuery<Result<List<CategoryWithAdsDto>>>;
