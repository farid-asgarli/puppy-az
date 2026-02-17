using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using PetWebsite.API.Constants;
using PetWebsite.API.Controllers.Base;
using PetWebsite.Application.Common.Models;
using PetWebsite.Application.Features.Admin.PetAdTypes;
using PetWebsite.Application.Features.Admin.PetAdTypes.Commands.Create;
using PetWebsite.Application.Features.Admin.PetAdTypes.Commands.Restore;
using PetWebsite.Application.Features.Admin.PetAdTypes.Commands.SoftDelete;
using PetWebsite.Application.Features.Admin.PetAdTypes.Commands.Update;
using PetWebsite.Application.Features.Admin.PetAdTypes.Queries.ListPetAdTypes;

namespace PetWebsite.API.Controllers.Admin;

/// <summary>
/// Controller for managing pet advertisement types (admin only).
/// </summary>
[Authorize(Roles = $"{AuthorizationConstants.Roles.SuperAdmin},{AuthorizationConstants.Roles.Admin}")]
public class PetAdTypesController(IMediator mediator, IStringLocalizer<PetAdTypesController> localizer)
	: AdminBaseController(mediator, localizer)
{
	/// <summary>
	/// Get a list of pet ad types with filtering and pagination.
	/// </summary>
	[HttpGet]
	[ProducesResponseType(typeof(PaginatedResult<PetAdTypeListItemDto>), 200)]
	public async Task<IActionResult> ListPetAdTypes([FromQuery] ListPetAdTypesQuery query)
	{
		var result = await Mediator.Send(query);
		return Ok(result);
	}

	/// <summary>
	/// Create a new pet ad type.
	/// </summary>
	[HttpPost]
	[ProducesResponseType(typeof(int), 201)]
	[ProducesResponseType(400)]
	public async Task<IActionResult> Create([FromBody] CreatePetAdTypeCommand command)
	{
		var result = await Mediator.Send(command);

		if (!result.IsSuccess)
			return result.StatusCode == 409 ? Conflict(result.Error) : BadRequest(result.Error);

		return StatusCode(201, result.Data);
	}

	/// <summary>
	/// Update an existing pet ad type.
	/// </summary>
	[HttpPut("{id}")]
	[ProducesResponseType(204)]
	[ProducesResponseType(400)]
	[ProducesResponseType(404)]
	public async Task<IActionResult> Update(int id, [FromBody] UpdatePetAdTypeCommand command)
	{
		if (id != command.Id)
			return BadRequest("ID mismatch");

		var result = await Mediator.Send(command);

		if (!result.IsSuccess)
			return result.StatusCode == 404 ? NotFound(result.Error) : BadRequest(result.Error);

		return NoContent();
	}

	/// <summary>
	/// Soft delete a pet ad type.
	/// </summary>
	[HttpDelete("{id}/soft")]
	[ProducesResponseType(204)]
	[ProducesResponseType(400)]
	[ProducesResponseType(404)]
	public async Task<IActionResult> SoftDelete(int id)
	{
		var userId = GetUserId();
		var result = await Mediator.Send(new SoftDeletePetAdTypeCommand(id, userId));

		if (!result.IsSuccess)
			return result.StatusCode == 404 ? NotFound(result.Error) : BadRequest(result.Error);

		return NoContent();
	}

	/// <summary>
	/// Restore a soft-deleted pet ad type.
	/// </summary>
	[HttpPost("{id}/restore")]
	[ProducesResponseType(204)]
	[ProducesResponseType(400)]
	[ProducesResponseType(404)]
	public async Task<IActionResult> Restore(int id)
	{
		var result = await Mediator.Send(new RestorePetAdTypeCommand(id));

		if (!result.IsSuccess)
			return result.StatusCode == 404 ? NotFound(result.Error) : BadRequest(result.Error);

		return NoContent();
	}
}
