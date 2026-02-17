using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using PetWebsite.API.Constants;
using PetWebsite.API.Controllers.Base;
using PetWebsite.Application.Features.Admin.StaticSections;
using PetWebsite.Application.Features.Admin.StaticSections.Commands.Create;
using PetWebsite.Application.Features.Admin.StaticSections.Commands.Update;
using PetWebsite.Application.Features.Admin.StaticSections.Queries.GetById;
using PetWebsite.Application.Features.Admin.StaticSections.Queries.GetByKey;
using PetWebsite.Application.Features.Admin.StaticSections.Queries.List;

namespace PetWebsite.API.Controllers.Admin;

/// <summary>
/// Controller for managing static content sections (admin only).
/// </summary>
[Authorize(Roles = $"{AuthorizationConstants.Roles.SuperAdmin},{AuthorizationConstants.Roles.Admin}")]
public class StaticSectionsController(IMediator mediator, IStringLocalizer<StaticSectionsController> localizer)
	: AdminBaseController(mediator, localizer)
{
	/// <summary>
	/// Get all static sections.
	/// </summary>
	[HttpGet]
	[ProducesResponseType(typeof(List<StaticSectionListItemDto>), 200)]
	public async Task<IActionResult> ListSections()
	{
		var result = await Mediator.Send(new ListStaticSectionsQuery());
		return Ok(result);
	}

	/// <summary>
	/// Get a static section by ID.
	/// </summary>
	[HttpGet("{id:int}")]
	[ProducesResponseType(typeof(StaticSectionDto), 200)]
	[ProducesResponseType(404)]
	public async Task<IActionResult> GetById(int id)
	{
		var result = await Mediator.Send(new GetStaticSectionByIdQuery(id));

		if (!result.IsSuccess)
			return NotFound(result.Error);

		return Ok(result.Data);
	}

	/// <summary>
	/// Get a static section by key.
	/// </summary>
	[HttpGet("key/{key}")]
	[AllowAnonymous]
	[ProducesResponseType(typeof(StaticSectionDto), 200)]
	[ProducesResponseType(404)]
	public async Task<IActionResult> GetByKey(string key)
	{
		var result = await Mediator.Send(new GetStaticSectionByKeyQuery(key));

		if (!result.IsSuccess)
			return NotFound(result.Error);

		return Ok(result.Data);
	}

	/// <summary>
	/// Create a new static section.
	/// </summary>
	[HttpPost]
	[ProducesResponseType(typeof(int), 201)]
	[ProducesResponseType(400)]
	public async Task<IActionResult> Create([FromBody] CreateStaticSectionCommand command)
	{
		var result = await Mediator.Send(command);

		if (!result.IsSuccess)
			return BadRequest(result.Error);

		return CreatedAtAction(nameof(GetById), new { id = result.Data }, result.Data);
	}

	/// <summary>
	/// Update an existing static section.
	/// </summary>
	[HttpPut("{id}")]
	[ProducesResponseType(204)]
	[ProducesResponseType(400)]
	[ProducesResponseType(404)]
	public async Task<IActionResult> Update(int id, [FromBody] UpdateStaticSectionCommand command)
	{
		if (id != command.Id)
			return BadRequest("ID mismatch");

		var result = await Mediator.Send(command);

		if (!result.IsSuccess)
		{
			return result.StatusCode switch
			{
				404 => NotFound(result.Error),
				_ => BadRequest(result.Error)
			};
		}

		return NoContent();
	}
}
