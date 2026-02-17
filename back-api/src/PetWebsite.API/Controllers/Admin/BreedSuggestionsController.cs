using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using PetWebsite.API.Constants;
using PetWebsite.API.Controllers.Base;
using PetWebsite.API.Extensions;
using PetWebsite.Application.Common.Models;
using PetWebsite.Application.Features.Admin.BreedSuggestions;
using PetWebsite.Application.Features.Admin.BreedSuggestions.Commands.Approve;
using PetWebsite.Application.Features.Admin.BreedSuggestions.Commands.Reject;
using PetWebsite.Application.Features.Admin.BreedSuggestions.Queries.ListBreedSuggestions;

namespace PetWebsite.API.Controllers.Admin;

/// <summary>
/// Controller for managing breed suggestions (admin only).
/// </summary>
[Authorize(Roles = $"{AuthorizationConstants.Roles.SuperAdmin},{AuthorizationConstants.Roles.Admin}")]
public class BreedSuggestionsController(IMediator mediator, IStringLocalizer<BreedSuggestionsController> localizer)
	: AdminBaseController(mediator, localizer)
{
	/// <summary>
	/// Get a list of breed suggestions with filtering and pagination.
	/// </summary>
	[HttpGet]
	[ProducesResponseType(typeof(PaginatedResult<BreedSuggestionListItemDto>), 200)]
	public async Task<IActionResult> ListSuggestions([FromQuery] ListBreedSuggestionsQuery query)
	{
		var result = await Mediator.Send(query);
		return Ok(result);
	}

	/// <summary>
	/// Approve a breed suggestion and create a new breed with localizations.
	/// </summary>
	[HttpPost("{id}/approve")]
	[ProducesResponseType(typeof(int), 201)]
	[ProducesResponseType(400)]
	[ProducesResponseType(404)]
	public async Task<IActionResult> Approve(int id, [FromBody] ApproveBreedSuggestionCommand command)
	{
		if (id != command.SuggestionId)
			return BadRequest("ID mismatch");

		var result = await Mediator.Send(command);

		if (!result.IsSuccess)
			return result.StatusCode == 404 ? NotFound(result.Error) : BadRequest(result.Error);

		return Ok(result.Data);
	}

	/// <summary>
	/// Reject a breed suggestion with an optional admin note.
	/// </summary>
	[HttpPost("{id}/reject")]
	[ProducesResponseType(204)]
	[ProducesResponseType(400)]
	[ProducesResponseType(404)]
	public async Task<IActionResult> Reject(int id, [FromBody] RejectBreedSuggestionCommand command)
	{
		if (id != command.SuggestionId)
			return BadRequest("ID mismatch");

		var result = await Mediator.Send(command);

		if (!result.IsSuccess)
			return result.StatusCode == 404 ? NotFound(result.Error) : BadRequest(result.Error);

		return NoContent();
	}
}
