using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using PetWebsite.API.Constants;
using PetWebsite.API.Controllers.Base;
using PetWebsite.Application.Common.Models;
using PetWebsite.Application.Features.Admin.PetCategories;
using PetWebsite.Application.Features.Admin.PetCategories.Commands.Create;
using PetWebsite.Application.Features.Admin.PetCategories.Commands.HardDelete;
using PetWebsite.Application.Features.Admin.PetCategories.Commands.Restore;
using PetWebsite.Application.Features.Admin.PetCategories.Commands.SoftDelete;
using PetWebsite.Application.Features.Admin.PetCategories.Commands.Update;
using PetWebsite.Application.Features.Admin.PetCategories.Queries;

namespace PetWebsite.API.Controllers.Admin;

/// <summary>
/// Controller for managing pet categories (admin only).
/// </summary>
[Authorize(Roles = AuthorizationConstants.Roles.Admin)]
public class PetCategoriesController(IMediator mediator, IStringLocalizer<PetCategoriesController> localizer)
	: AdminBaseController(mediator, localizer)
{
	/// <summary>
	/// Get a list of pet categories with filtering and pagination.
	/// </summary>
	[HttpGet]
	[ProducesResponseType(typeof(PaginatedResult<PetCategoryListItemDto>), 200)]
	public async Task<IActionResult> ListCategories([FromQuery] ListPetCategoriesQuery query)
	{
		var result = await Mediator.Send(query);
		return Ok(result);
	}

	/// <summary>
	/// Get a pet category by ID.
	/// </summary>
	[HttpGet("{id}")]
	[ProducesResponseType(typeof(PetCategoryDto), 200)]
	[ProducesResponseType(404)]
	public async Task<IActionResult> GetById(int id)
	{
		var result = await Mediator.Send(new GetPetCategoryByIdQuery(id));

		if (!result.IsSuccess)
			return NotFound(result.Error);

		return Ok(result.Data);
	}

	/// <summary>
	/// Create a new pet category.
	/// </summary>
	[HttpPost]
	[ProducesResponseType(typeof(int), 201)]
	[ProducesResponseType(400)]
	public async Task<IActionResult> Create([FromBody] CreatePetCategoryCommand command)
	{
		var result = await Mediator.Send(command);

		if (!result.IsSuccess)
			return BadRequest(result.Error);

		return CreatedAtAction(nameof(GetById), new { id = result.Data }, result.Data);
	}

	/// <summary>
	/// Update an existing pet category.
	/// </summary>
	[HttpPut("{id}")]
	[ProducesResponseType(204)]
	[ProducesResponseType(400)]
	[ProducesResponseType(404)]
	public async Task<IActionResult> Update(int id, [FromBody] UpdatePetCategoryCommand command)
	{
		if (id != command.Id)
			return BadRequest("ID mismatch");

		var result = await Mediator.Send(command);

		if (!result.IsSuccess)
			return result.StatusCode == 404 ? NotFound(result.Error) : BadRequest(result.Error);

		return NoContent();
	}

	/// <summary>
	/// Soft delete a pet category.
	/// </summary>
	[HttpDelete("{id}/soft")]
	[ProducesResponseType(204)]
	[ProducesResponseType(404)]
	public async Task<IActionResult> SoftDelete(int id)
	{
		var userId = GetUserId();
		var result = await Mediator.Send(new SoftDeletePetCategoryCommand(id, userId));

		if (!result.IsSuccess)
			return NotFound(result.Error);

		return NoContent();
	}

	/// <summary>
	/// Permanently delete a pet category.
	/// </summary>
	[HttpDelete("{id}")]
	[ProducesResponseType(204)]
	[ProducesResponseType(400)]
	[ProducesResponseType(404)]
	public async Task<IActionResult> HardDelete(int id)
	{
		var result = await Mediator.Send(new HardDeletePetCategoryCommand(id));

		if (!result.IsSuccess)
			return result.StatusCode == 404 ? NotFound(result.Error) : BadRequest(result.Error);

		return NoContent();
	}

	/// <summary>
	/// Restore a soft-deleted pet category.
	/// </summary>
	[HttpPost("{id}/restore")]
	[ProducesResponseType(204)]
	[ProducesResponseType(404)]
	public async Task<IActionResult> Restore(int id)
	{
		var result = await Mediator.Send(new RestorePetCategoryCommand(id));

		if (!result.IsSuccess)
			return NotFound(result.Error);

		return NoContent();
	}
}
