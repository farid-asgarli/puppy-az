using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Messages.Commands.SendMessage;

/// <summary>
/// Command to send a message to a pet ad owner.
/// </summary>
public record SendMessageCommand : ICommand<Result<SendMessageResponse>>
{
	/// <summary>
	/// The ID of the user to send the message to (pet ad owner).
	/// </summary>
	public Guid ReceiverId { get; init; }

	/// <summary>
	/// The ID of the pet ad this message is about.
	/// </summary>
	public int PetAdId { get; init; }

	/// <summary>
	/// The message content.
	/// </summary>
	public string Content { get; init; } = null!;
}

/// <summary>
/// Response for SendMessageCommand.
/// </summary>
public record SendMessageResponse
{
	/// <summary>
	/// The ID of the conversation.
	/// </summary>
	public int ConversationId { get; init; }
}
