using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Users.Queries.GetUserDashboardStats;

/// <summary>
/// Query to get the current user's dashboard statistics.
/// </summary>
public record GetUserDashboardStatsQuery : IQuery<Result<UserDashboardStatsDto>>;
