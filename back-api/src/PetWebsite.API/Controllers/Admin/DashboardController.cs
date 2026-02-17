using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using PetWebsite.API.Constants;
using PetWebsite.API.Controllers.Base;
using PetWebsite.API.Extensions;
using PetWebsite.Application.Features.Admin.Dashboard.Queries.GetChartStats;
using PetWebsite.Application.Features.Admin.Dashboard.Queries.GetDashboardStats;
using PetWebsite.Application.Features.Admin.Dashboard.Queries.GetListingStats;

namespace PetWebsite.API.Controllers.Admin;

/// <summary>
/// Controller for admin dashboard endpoints.
/// </summary>
[Authorize(Roles = $"{AuthorizationConstants.Roles.SuperAdmin},{AuthorizationConstants.Roles.Admin}")]
public class DashboardController(IMediator mediator, IStringLocalizer<DashboardController> localizer) : AdminBaseController(mediator, localizer)
{
	/// <summary>
	/// Get overall dashboard statistics for admin panel.
	/// </summary>
	/// <param name="cancellationToken">Cancellation token</param>
	/// <returns>Dashboard statistics including users, listings, messages</returns>
	/// <response code="200">Returns the dashboard statistics</response>
	[HttpGet("stats")]
	[ProducesResponseType(typeof(DashboardStatsDto), StatusCodes.Status200OK)]
	public async Task<IActionResult> GetDashboardStats(CancellationToken cancellationToken)
	{
		var result = await Mediator.Send(new GetDashboardStatsQuery(), cancellationToken);

		if (result.IsSuccess)
			return Ok(result.Data);

		return result.ToActionResult();
	}

	/// <summary>
	/// Get chart statistics for admin dashboard.
	/// </summary>
	/// <param name="period">Period type: 'monthly' or 'yearly'</param>
	/// <param name="year">Year for monthly statistics (default: current year)</param>
	/// <param name="cancellationToken">Cancellation token</param>
	/// <returns>Chart statistics including trends, distributions, rankings</returns>
	/// <response code="200">Returns the chart statistics</response>
	[HttpGet("chart-stats")]
	[ProducesResponseType(typeof(ChartStatsDto), StatusCodes.Status200OK)]
	public async Task<IActionResult> GetChartStats(
		[FromQuery] string period = "monthly",
		[FromQuery] int year = 0,
		CancellationToken cancellationToken = default)
	{
		var result = await Mediator.Send(new GetChartStatsQuery(period, year), cancellationToken);

		if (result.IsSuccess)
			return Ok(result.Data);

		return result.ToActionResult();
	}

	/// <summary>
	/// Get listing statistics for admin dashboard.
	/// </summary>
	/// <param name="cancellationToken">Cancellation token</param>
	/// <returns>Listing statistics by status</returns>
	/// <response code="200">Returns the listing statistics</response>
	[HttpGet("listing-stats")]
	[ProducesResponseType(typeof(ListingStatsDto), StatusCodes.Status200OK)]
	public async Task<IActionResult> GetListingStats(CancellationToken cancellationToken)
	{
		var result = await Mediator.Send(new GetListingStatsQuery(), cancellationToken);

		if (result.IsSuccess)
			return Ok(result.Data);

		return result.ToActionResult();
	}
}
