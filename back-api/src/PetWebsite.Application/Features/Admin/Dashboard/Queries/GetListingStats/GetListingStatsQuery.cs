using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Admin.Dashboard.Queries.GetListingStats;

/// <summary>
/// Query to get listing statistics for admin dashboard.
/// </summary>
public record GetListingStatsQuery : IQuery<Result<ListingStatsDto>>;
