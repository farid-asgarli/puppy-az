using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using PetWebsite.API.Constants;
using PetWebsite.API.Controllers.Base;
using PetWebsite.Application.Common.Models;
using PetWebsite.Application.Features.Admin.Districts;
using PetWebsite.Application.Features.Admin.Districts.Commands.Create;
using PetWebsite.Application.Features.Admin.Districts.Commands.HardDelete;
using PetWebsite.Application.Features.Admin.Districts.Commands.Restore;
using PetWebsite.Application.Features.Admin.Districts.Commands.SoftDelete;
using PetWebsite.Application.Features.Admin.Districts.Commands.Update;
using PetWebsite.Application.Features.Admin.Districts.Queries;

namespace PetWebsite.API.Controllers.Admin;

/// <summary>
/// Controller for managing districts (admin only).
/// </summary>
[Authorize(Roles = $"{AuthorizationConstants.Roles.SuperAdmin},{AuthorizationConstants.Roles.Admin}")]
public class DistrictsController(IMediator mediator, IStringLocalizer<DistrictsController> localizer) : AdminBaseController(mediator, localizer)
{
	/// <summary>
	/// Get a list of districts with filtering and pagination.
	/// </summary>
	[HttpGet]
	[ProducesResponseType(typeof(PaginatedResult<DistrictListItemDto>), 200)]
	public async Task<IActionResult> ListDistricts([FromQuery] ListDistrictsQuery query)
	{
		var result = await Mediator.Send(query);
		return Ok(result);
	}

	/// <summary>
	/// Get a district by ID.
	/// </summary>
	[HttpGet("{id}")]
	[ProducesResponseType(typeof(DistrictDto), 200)]
	[ProducesResponseType(404)]
	public async Task<IActionResult> GetById(int id)
	{
		var result = await Mediator.Send(new GetDistrictByIdQuery(id));

		if (!result.IsSuccess)
			return NotFound(result.Error);

		return Ok(result.Data);
	}

	/// <summary>
	/// Create a new district.
	/// </summary>
	[HttpPost]
	[ProducesResponseType(typeof(int), 201)]
	[ProducesResponseType(400)]
	public async Task<IActionResult> Create([FromBody] CreateDistrictCommand command)
	{
		var result = await Mediator.Send(command);

		if (!result.IsSuccess)
			return BadRequest(result.Error);

		if (result.StatusCode == 200)
			return Ok(new { id = result.Data, alreadyExists = true });

		return CreatedAtAction(nameof(GetById), new { id = result.Data }, new { id = result.Data });
	}

	/// <summary>
	/// Update an existing district.
	/// </summary>
	[HttpPut("{id}")]
	[ProducesResponseType(204)]
	[ProducesResponseType(400)]
	[ProducesResponseType(404)]
	public async Task<IActionResult> Update(int id, [FromBody] UpdateDistrictCommand command)
	{
		if (id != command.Id)
			return BadRequest("ID mismatch");

		var result = await Mediator.Send(command);

		if (!result.IsSuccess)
			return result.StatusCode == 404 ? NotFound(result.Error) : BadRequest(result.Error);

		return NoContent();
	}

	/// <summary>
	/// Soft delete a district.
	/// </summary>
	[HttpDelete("{id}/soft")]
	[ProducesResponseType(204)]
	[ProducesResponseType(400)]
	[ProducesResponseType(404)]
	public async Task<IActionResult> SoftDelete(int id)
	{
		var userId = GetUserId();
		var result = await Mediator.Send(new SoftDeleteDistrictCommand(id, userId));

		if (!result.IsSuccess)
			return result.StatusCode == 404 ? NotFound(result.Error) : BadRequest(result.Error);

		return NoContent();
	}

	/// <summary>
	/// Permanently delete a district.
	/// </summary>
	[HttpDelete("{id}")]
	[ProducesResponseType(204)]
	[ProducesResponseType(400)]
	[ProducesResponseType(404)]
	public async Task<IActionResult> HardDelete(int id)
	{
		var result = await Mediator.Send(new HardDeleteDistrictCommand(id));

		if (!result.IsSuccess)
			return result.StatusCode == 404 ? NotFound(result.Error) : BadRequest(result.Error);

		return NoContent();
	}

	/// <summary>
	/// Restore a soft-deleted district.
	/// </summary>
	[HttpPost("{id}/restore")]
	[ProducesResponseType(204)]
	[ProducesResponseType(404)]
	public async Task<IActionResult> Restore(int id)
	{
		var result = await Mediator.Send(new RestoreDistrictCommand(id));

		if (!result.IsSuccess)
			return NotFound(result.Error);

		return NoContent();
	}
}
