using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using PetWebsite.API.Controllers.Base;
using PetWebsite.API.Extensions;
using PetWebsite.Application.Features.Messages.Commands.SendMessage;

namespace PetWebsite.API.Controllers.Messages;

/// <summary>
/// Controller for messaging operations.
/// </summary>
[Route("api/messages")]
[Authorize]
public class MessagesController(IMediator mediator, IStringLocalizer<MessagesController> localizer)
	: BaseApiController(mediator, localizer)
{
	/// <summary>
	/// Send a message to a pet ad owner.
	/// </summary>
	/// <param name="command">Message details</param>
	/// <param name="cancellationToken">Cancellation token</param>
	/// <returns>The conversation ID</returns>
	/// <response code="200">Message sent successfully</response>
	/// <response code="400">Invalid request data or cannot message yourself</response>
	/// <response code="401">User is not authenticated</response>
	/// <response code="404">Pet ad or receiver not found</response>
	[HttpPost]
	[ProducesResponseType(typeof(SendMessageResponse), StatusCodes.Status200OK)]
	[ProducesResponseType(StatusCodes.Status400BadRequest)]
	[ProducesResponseType(StatusCodes.Status401Unauthorized)]
	[ProducesResponseType(StatusCodes.Status404NotFound)]
	public async Task<IActionResult> SendMessage(
		[FromBody] SendMessageCommand command,
		CancellationToken cancellationToken)
	{
		var result = await Mediator.Send(command, cancellationToken);
		return result.ToActionResult();
	}
}
