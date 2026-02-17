using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Admin.Dashboard.Queries.GetDashboardStats;

/// <summary>
/// Query to get dashboard statistics for admin panel.
/// </summary>
public record GetDashboardStatsQuery : IQuery<Result<DashboardStatsDto>>;
