using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Admin.Dashboard.Queries.GetChartStats;

/// <summary>
/// Query to get chart statistics for admin dashboard.
/// </summary>
public record GetChartStatsQuery(string Period = "monthly", int Year = 0) : IQuery<Result<ChartStatsDto>>;
