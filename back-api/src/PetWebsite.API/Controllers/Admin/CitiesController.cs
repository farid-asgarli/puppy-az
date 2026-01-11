using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using PetWebsite.API.Constants;
using PetWebsite.API.Controllers.Base;
using PetWebsite.Application.Common.Models;
using PetWebsite.Application.Features.Admin.Cities;
using PetWebsite.Application.Features.Admin.Cities.Commands.Create;
using PetWebsite.Application.Features.Admin.Cities.Commands.HardDelete;
using PetWebsite.Application.Features.Admin.Cities.Commands.Restore;
using PetWebsite.Application.Features.Admin.Cities.Commands.SoftDelete;
using PetWebsite.Application.Features.Admin.Cities.Commands.Update;
using PetWebsite.Application.Features.Admin.Cities.Queries;

namespace PetWebsite.API.Controllers.Admin;

/// <summary>
/// Controller for managing cities (admin only).
/// </summary>
[Authorize(Roles = AuthorizationConstants.Roles.Admin)]
public class CitiesController(IMediator mediator, IStringLocalizer<CitiesController> localizer) : AdminBaseController(mediator, localizer)
{
	/// <summary>
	/// Get a list of cities with filtering and pagination.
	/// </summary>
	[HttpGet]
	[ProducesResponseType(typeof(PaginatedResult<CityListItemDto>), 200)]
	public async Task<IActionResult> ListCities([FromQuery] ListCitiesQuery query)
	{
		var result = await Mediator.Send(query);
		return Ok(result);
	}

	/// <summary>
	/// Get a city by ID.
	/// </summary>
	[HttpGet("{id}")]
	[ProducesResponseType(typeof(CityDto), 200)]
	[ProducesResponseType(404)]
	public async Task<IActionResult> GetById(int id)
	{
		var result = await Mediator.Send(new GetCityByIdQuery(id));

		if (!result.IsSuccess)
			return NotFound(result.Error);

		return Ok(result.Data);
	}

	/// <summary>
	/// Create a new city.
	/// </summary>
	[HttpPost]
	[ProducesResponseType(typeof(int), 201)]
	[ProducesResponseType(400)]
	public async Task<IActionResult> Create([FromBody] CreateCityCommand command)
	{
		var result = await Mediator.Send(command);

		if (!result.IsSuccess)
			return BadRequest(result.Error);

		return CreatedAtAction(nameof(GetById), new { id = result.Data }, result.Data);
	}

	/// <summary>
	/// Update an existing city.
	/// </summary>
	[HttpPut("{id}")]
	[ProducesResponseType(204)]
	[ProducesResponseType(400)]
	[ProducesResponseType(404)]
	public async Task<IActionResult> Update(int id, [FromBody] UpdateCityCommand command)
	{
		if (id != command.Id)
			return BadRequest("ID mismatch");

		var result = await Mediator.Send(command);

		if (!result.IsSuccess)
			return result.StatusCode == 404 ? NotFound(result.Error) : BadRequest(result.Error);

		return NoContent();
	}

	/// <summary>
	/// Soft delete a city.
	/// </summary>
	[HttpDelete("{id}/soft")]
	[ProducesResponseType(204)]
	[ProducesResponseType(404)]
	public async Task<IActionResult> SoftDelete(int id)
	{
		var userId = GetUserId();
		var result = await Mediator.Send(new SoftDeleteCityCommand(id, userId));

		if (!result.IsSuccess)
			return NotFound(result.Error);

		return NoContent();
	}

	/// <summary>
	/// Permanently delete a city.
	/// </summary>
	[HttpDelete("{id}")]
	[ProducesResponseType(204)]
	[ProducesResponseType(400)]
	[ProducesResponseType(404)]
	public async Task<IActionResult> HardDelete(int id)
	{
		var result = await Mediator.Send(new HardDeleteCityCommand(id));

		if (!result.IsSuccess)
			return result.StatusCode == 404 ? NotFound(result.Error) : BadRequest(result.Error);

		return NoContent();
	}

	/// <summary>
	/// Restore a soft-deleted city.
	/// </summary>
	[HttpPost("{id}/restore")]
	[ProducesResponseType(204)]
	[ProducesResponseType(404)]
	public async Task<IActionResult> Restore(int id)
	{
		var result = await Mediator.Send(new RestoreCityCommand(id));

		if (!result.IsSuccess)
			return NotFound(result.Error);

		return NoContent();
	}
}
