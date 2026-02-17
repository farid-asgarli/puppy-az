using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using PetWebsite.API.Controllers.Base;
using PetWebsite.API.Extensions;
using PetWebsite.Application.Features.Districts;
using PetWebsite.Application.Features.Districts.Queries.GetDistrictsByCity;

namespace PetWebsite.API.Controllers.Districts;

/// <summary>
/// Controller for district operations.
/// </summary>
public class DistrictsController(IMediator mediator, IStringLocalizer<DistrictsController> localizer) : BaseApiController(mediator, localizer)
{
	/// <summary>
	/// Get all active districts for a specific city.
	/// </summary>
	[HttpGet("by-city/{cityId:int}")]
	[ProducesResponseType(typeof(List<DistrictDto>), StatusCodes.Status200OK)]
	public async Task<IActionResult> GetDistrictsByCity(int cityId, CancellationToken cancellationToken)
	{
		var result = await Mediator.Send(new GetDistrictsByCityQuery(cityId), cancellationToken);

		if (result.IsSuccess)
			return Ok(result.Data);

		return result.ToActionResult();
	}
}
