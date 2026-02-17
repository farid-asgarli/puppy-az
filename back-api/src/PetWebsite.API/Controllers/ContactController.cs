using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using PetWebsite.API.Controllers.Base;
using PetWebsite.Application.Features.ContactMessages;
using PetWebsite.Application.Features.ContactMessages.Commands;
using PetWebsite.Domain.Enums;

namespace PetWebsite.API.Controllers;

/// <summary>
/// Controller for submitting contact messages from public website.
/// </summary>
[Route("api/contact")]
public class ContactController(IMediator mediator, IStringLocalizer<ContactController> localizer)
	: BaseApiController(mediator, localizer)
{
	/// <summary>
	/// Submit a contact form message.
	/// </summary>
	[HttpPost]
	[AllowAnonymous]
	[ProducesResponseType(typeof(object), 201)]
	[ProducesResponseType(400)]
	public async Task<IActionResult> Submit([FromBody] CreateContactMessageDto dto)
	{
		if (string.IsNullOrWhiteSpace(dto.Message))
			return BadRequest(new { error = "Message is required" });

		// Get user ID if authenticated
		Guid? userId = null;
		if (User.Identity?.IsAuthenticated == true)
		{
			var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
			if (Guid.TryParse(userIdClaim, out var parsedUserId))
				userId = parsedUserId;
		}

		var command = new CreateContactMessageCommand
		{
			SenderName = dto.SenderName,
			SenderEmail = dto.SenderEmail,
			SenderPhone = dto.SenderPhone,
			UserId = userId,
			Subject = dto.Subject,
			Message = dto.Message,
			MessageType = dto.MessageType,
			LanguageCode = dto.LanguageCode,
			IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString(),
			UserAgent = Request.Headers.UserAgent.ToString(),
			SourceUrl = Request.Headers.Referer.ToString()
		};

		var id = await Mediator.Send(command);

		return Created($"/api/contact/{id}", new { id, message = "Message sent successfully" });
	}
}
