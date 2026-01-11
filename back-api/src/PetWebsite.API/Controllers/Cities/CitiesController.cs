using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using PetWebsite.API.Controllers.Base;
using PetWebsite.API.Extensions;
using PetWebsite.Application.Features.Cities;
using PetWebsite.Application.Features.Cities.Queries.GetCities;

namespace PetWebsite.API.Controllers.Cities;

/// <summary>
/// Controller for city operations.
/// </summary>
public class CitiesController(IMediator mediator, IStringLocalizer<CitiesController> localizer) : BaseApiController(mediator, localizer)
{
	/// <summary>
	/// Get all active cities.
	/// </summary>
	/// <param name="cancellationToken">Cancellation token</param>
	/// <returns>List of active cities</returns>
	/// <response code="200">Returns the list of active cities</response>
	[HttpGet]
	[ProducesResponseType(typeof(List<CityDto>), StatusCodes.Status200OK)]
	public async Task<IActionResult> GetCities(CancellationToken cancellationToken)
	{
		var result = await Mediator.Send(new GetCitiesQuery(), cancellationToken);

		if (result.IsSuccess)
			return Ok(result.Data);

		return result.ToActionResult();
	}
}
