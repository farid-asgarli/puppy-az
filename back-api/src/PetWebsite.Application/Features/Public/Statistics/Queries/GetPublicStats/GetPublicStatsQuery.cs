using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Public.Statistics.Queries.GetPublicStats;

/// <summary>
/// Query to get public statistics.
/// </summary>
public record GetPublicStatsQuery : IQuery<Result<PublicStatsDto>>;
