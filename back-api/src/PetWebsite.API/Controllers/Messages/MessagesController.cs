using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using PetWebsite.API.Controllers.Base;
using PetWebsite.API.Extensions;
using PetWebsite.API.Services;
using PetWebsite.Application.Features.Messages.Commands.SendMessage;

namespace PetWebsite.API.Controllers.Messages;

/// <summary>
/// Controller for messaging operations.
/// </summary>
[Route("api/messages")]
[Authorize]
public class MessagesController(
	IMediator mediator, 
	IStringLocalizer<MessagesController> localizer,
	INotificationService notificationService)
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
		
		// Send real-time notification if message was sent successfully
		if (result.IsSuccess && result.Data != null)
		{
			try
			{
				// Send notification to the receiver
				await notificationService.SendNewMessageAsync(
					command.ReceiverId.ToString(),
					new NewMessageNotification
					{
						ConversationId = result.Data.ConversationId,
						MessageId = 0, // We don't have the message ID in the response
						SenderName = User.Identity?.Name ?? "Unknown",
						Content = command.Content.Length > 100 ? command.Content[..97] + "..." : command.Content,
						SentAt = DateTime.UtcNow,
						UnreadCount = 1
					});

				// Also send to conversation group for real-time updates
				await notificationService.SendMessageToConversationAsync(
					result.Data.ConversationId,
					new ConversationMessageNotification
					{
						ConversationId = result.Data.ConversationId,
						MessageId = 0,
						SenderId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "",
						SenderName = User.Identity?.Name ?? "Unknown",
						Content = command.Content,
						SentAt = DateTime.UtcNow
					});
			}
			catch (Exception ex)
			{
				// Log but don't fail the request if notification fails
				Console.WriteLine($"[SignalR] Failed to send notification: {ex.Message}");
			}
		}
		
		return result.ToActionResult();
	}
}
