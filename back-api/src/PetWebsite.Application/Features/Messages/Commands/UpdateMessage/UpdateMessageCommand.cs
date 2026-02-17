using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Messages.Commands.UpdateMessage;

/// <summary>
/// Command to update a message content.
/// </summary>
public record UpdateMessageCommand : ICommand<Result>
{
    /// <summary>
    /// The ID of the message to update.
    /// </summary>
    public int MessageId { get; init; }

    /// <summary>
    /// The new message content.
    /// </summary>
    public string Content { get; init; } = null!;
}
