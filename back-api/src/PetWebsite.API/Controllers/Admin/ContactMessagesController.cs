using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using PetWebsite.API.Constants;
using PetWebsite.API.Controllers.Base;
using PetWebsite.Application.Common.Models;
using PetWebsite.Application.Features.ContactMessages;
using PetWebsite.Application.Features.ContactMessages.Commands;
using PetWebsite.Application.Features.ContactMessages.Queries;

namespace PetWebsite.API.Controllers.Admin;

/// <summary>
/// Controller for managing contact messages (admin only).
/// </summary>
[Authorize(Roles = $"{AuthorizationConstants.Roles.SuperAdmin},{AuthorizationConstants.Roles.Admin}")]
public class ContactMessagesController(IMediator mediator, IStringLocalizer<ContactMessagesController> localizer)
	: AdminBaseController(mediator, localizer)
{
	/// <summary>
	/// Get a list of contact messages with filtering and pagination.
	/// </summary>
	[HttpGet]
	[ProducesResponseType(typeof(PaginatedResult<ContactMessageListItemDto>), 200)]
	public async Task<IActionResult> List([FromQuery] ListContactMessagesQuery query)
	{
		var result = await Mediator.Send(query);
		return Ok(result);
	}

	/// <summary>
	/// Get contact message statistics.
	/// </summary>
	[HttpGet("stats")]
	[ProducesResponseType(typeof(ContactMessageStatsDto), 200)]
	public async Task<IActionResult> GetStats()
	{
		var result = await Mediator.Send(new GetContactMessageStatsQuery());
		return Ok(result);
	}

	/// <summary>
	/// Get a contact message by ID.
	/// </summary>
	[HttpGet("{id}")]
	[ProducesResponseType(typeof(ContactMessageDetailDto), 200)]
	[ProducesResponseType(404)]
	public async Task<IActionResult> GetById(int id, [FromQuery] bool markAsRead = true)
	{
		var result = await Mediator.Send(new GetContactMessageQuery { Id = id, MarkAsRead = markAsRead });

		if (result == null)
			return NotFound();

		return Ok(result);
	}

	/// <summary>
	/// Reply to a contact message.
	/// </summary>
	[HttpPost("{id}/reply")]
	[ProducesResponseType(204)]
	[ProducesResponseType(404)]
	public async Task<IActionResult> Reply(int id, [FromBody] ReplyContactMessageDto dto)
	{
		var result = await Mediator.Send(new ReplyContactMessageCommand
		{
			Id = id,
			Reply = dto.Reply
		});

		if (!result)
			return NotFound();

		return NoContent();
	}

	/// <summary>
	/// Update contact message flags (status, spam, starred, archived, notes).
	/// </summary>
	[HttpPatch("{id}")]
	[ProducesResponseType(204)]
	[ProducesResponseType(404)]
	public async Task<IActionResult> Update(int id, [FromBody] UpdateContactMessageDto dto)
	{
		var result = await Mediator.Send(new UpdateContactMessageCommand
		{
			Id = id,
			Status = dto.Status,
			IsSpam = dto.IsSpam,
			IsStarred = dto.IsStarred,
			IsArchived = dto.IsArchived,
			InternalNotes = dto.InternalNotes
		});

		if (!result)
			return NotFound();

		return NoContent();
	}

	/// <summary>
	/// Mark a message as spam.
	/// </summary>
	[HttpPost("{id}/spam")]
	[ProducesResponseType(204)]
	[ProducesResponseType(404)]
	public async Task<IActionResult> MarkAsSpam(int id)
	{
		var result = await Mediator.Send(new UpdateContactMessageCommand
		{
			Id = id,
			IsSpam = true
		});

		if (!result)
			return NotFound();

		return NoContent();
	}

	/// <summary>
	/// Unmark a message as spam.
	/// </summary>
	[HttpDelete("{id}/spam")]
	[ProducesResponseType(204)]
	[ProducesResponseType(404)]
	public async Task<IActionResult> UnmarkAsSpam(int id)
	{
		var result = await Mediator.Send(new UpdateContactMessageCommand
		{
			Id = id,
			IsSpam = false
		});

		if (!result)
			return NotFound();

		return NoContent();
	}

	/// <summary>
	/// Toggle starred status.
	/// </summary>
	[HttpPost("{id}/star")]
	[ProducesResponseType(204)]
	[ProducesResponseType(404)]
	public async Task<IActionResult> ToggleStar(int id, [FromQuery] bool starred = true)
	{
		var result = await Mediator.Send(new UpdateContactMessageCommand
		{
			Id = id,
			IsStarred = starred
		});

		if (!result)
			return NotFound();

		return NoContent();
	}

	/// <summary>
	/// Archive a message.
	/// </summary>
	[HttpPost("{id}/archive")]
	[ProducesResponseType(204)]
	[ProducesResponseType(404)]
	public async Task<IActionResult> Archive(int id)
	{
		var result = await Mediator.Send(new UpdateContactMessageCommand
		{
			Id = id,
			IsArchived = true
		});

		if (!result)
			return NotFound();

		return NoContent();
	}

	/// <summary>
	/// Unarchive a message.
	/// </summary>
	[HttpDelete("{id}/archive")]
	[ProducesResponseType(204)]
	[ProducesResponseType(404)]
	public async Task<IActionResult> Unarchive(int id)
	{
		var result = await Mediator.Send(new UpdateContactMessageCommand
		{
			Id = id,
			IsArchived = false
		});

		if (!result)
			return NotFound();

		return NoContent();
	}

	/// <summary>
	/// Delete a contact message permanently.
	/// </summary>
	[HttpDelete("{id}")]
	[ProducesResponseType(204)]
	[ProducesResponseType(404)]
	public async Task<IActionResult> Delete(int id)
	{
		var result = await Mediator.Send(new DeleteContactMessageCommand { Id = id });

		if (!result)
			return NotFound();

		return NoContent();
	}
}
