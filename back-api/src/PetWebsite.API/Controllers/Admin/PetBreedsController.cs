using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using PetWebsite.API.Constants;
using PetWebsite.API.Controllers.Base;
using PetWebsite.Application.Common.Models;
using PetWebsite.Application.Features.Admin.PetBreeds;
using PetWebsite.Application.Features.Admin.PetBreeds.Commands.Create;
using PetWebsite.Application.Features.Admin.PetBreeds.Commands.HardDelete;
using PetWebsite.Application.Features.Admin.PetBreeds.Commands.Restore;
using PetWebsite.Application.Features.Admin.PetBreeds.Commands.SoftDelete;
using PetWebsite.Application.Features.Admin.PetBreeds.Commands.Update;
using PetWebsite.Application.Features.Admin.PetBreeds.Queries.GetPetBreedById;
using PetWebsite.Application.Features.Admin.PetBreeds.Queries.ListPetBreeds;

namespace PetWebsite.API.Controllers.Admin;

/// <summary>
/// Controller for managing pet breeds (admin only).
/// </summary>
[Authorize(Roles = AuthorizationConstants.Roles.Admin)]
public class PetBreedsController(IMediator mediator, IStringLocalizer<PetBreedsController> localizer)
	: AdminBaseController(mediator, localizer)
{
	/// <summary>
	/// Get a list of pet breeds with filtering and pagination.
	/// </summary>
	[HttpGet]
	[ProducesResponseType(typeof(PaginatedResult<PetBreedListItemDto>), 200)]
	public async Task<IActionResult> ListBreeds([FromQuery] ListPetBreedsQuery query)
	{
		var result = await Mediator.Send(query);
		return Ok(result);
	}

	/// <summary>
	/// Get a pet breed by ID.
	/// </summary>
	[HttpGet("{id}")]
	[ProducesResponseType(typeof(PetBreedDto), 200)]
	[ProducesResponseType(404)]
	public async Task<IActionResult> GetById(int id)
	{
		var result = await Mediator.Send(new GetPetBreedByIdQuery(id));

		if (!result.IsSuccess)
			return NotFound(result.Error);

		return Ok(result.Data);
	}

	/// <summary>
	/// Create a new pet breed.
	/// </summary>
	[HttpPost]
	[ProducesResponseType(typeof(int), 201)]
	[ProducesResponseType(400)]
	public async Task<IActionResult> Create([FromBody] CreatePetBreedCommand command)
	{
		var result = await Mediator.Send(command);

		if (!result.IsSuccess)
			return BadRequest(result.Error);

		return CreatedAtAction(nameof(GetById), new { id = result.Data }, result.Data);
	}

	/// <summary>
	/// Update an existing pet breed.
	/// </summary>
	[HttpPut("{id}")]
	[ProducesResponseType(204)]
	[ProducesResponseType(400)]
	[ProducesResponseType(404)]
	public async Task<IActionResult> Update(int id, [FromBody] UpdatePetBreedCommand command)
	{
		if (id != command.Id)
			return BadRequest("ID mismatch");

		var result = await Mediator.Send(command);

		if (!result.IsSuccess)
			return result.StatusCode == 404 ? NotFound(result.Error) : BadRequest(result.Error);

		return NoContent();
	}

	/// <summary>
	/// Soft delete a pet breed.
	/// </summary>
	[HttpDelete("{id}/soft")]
	[ProducesResponseType(204)]
	[ProducesResponseType(404)]
	public async Task<IActionResult> SoftDelete(int id)
	{
		var userId = GetUserId();
		var result = await Mediator.Send(new SoftDeletePetBreedCommand(id, userId));

		if (!result.IsSuccess)
			return NotFound(result.Error);

		return NoContent();
	}

	/// <summary>
	/// Permanently delete a pet breed.
	/// </summary>
	[HttpDelete("{id}")]
	[ProducesResponseType(204)]
	[ProducesResponseType(400)]
	[ProducesResponseType(404)]
	public async Task<IActionResult> HardDelete(int id)
	{
		var result = await Mediator.Send(new HardDeletePetBreedCommand(id));

		if (!result.IsSuccess)
			return result.StatusCode == 404 ? NotFound(result.Error) : BadRequest(result.Error);

		return NoContent();
	}

	/// <summary>
	/// Restore a soft-deleted pet breed.
	/// </summary>
	[HttpPost("{id}/restore")]
	[ProducesResponseType(204)]
	[ProducesResponseType(404)]
	public async Task<IActionResult> Restore(int id)
	{
		var result = await Mediator.Send(new RestorePetBreedCommand(id));

		if (!result.IsSuccess)
			return NotFound(result.Error);

		return NoContent();
	}
}
