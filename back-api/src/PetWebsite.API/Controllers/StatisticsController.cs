using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using PetWebsite.API.Controllers.Base;
using PetWebsite.Application.Features.Public.Statistics.Queries.GetPublicStats;

namespace PetWebsite.API.Controllers;

/// <summary>
/// Public statistics endpoint.
/// </summary>
[Route("api/statistics")]
public class StatisticsController(IMediator mediator, IStringLocalizer<StatisticsController> localizer) 
	: BaseApiController(mediator, localizer)
{
	/// <summary>
	/// Get public statistics (active ads, users count).
	/// </summary>
	/// <param name="cancellationToken">Cancellation token</param>
	/// <returns>Public statistics</returns>
	/// <response code="200">Returns the public statistics</response>
	[HttpGet]
	[ProducesResponseType(typeof(PublicStatsDto), StatusCodes.Status200OK)]
	public async Task<IActionResult> GetPublicStats(CancellationToken cancellationToken)
	{
		var result = await Mediator.Send(new GetPublicStatsQuery(), cancellationToken);

		if (result.IsSuccess)
			return Ok(result.Data);

		return BadRequest(result.Error);
	}
}
