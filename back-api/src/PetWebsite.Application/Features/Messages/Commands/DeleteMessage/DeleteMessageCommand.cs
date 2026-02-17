using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Messages.Commands.DeleteMessage;

/// <summary>
/// Command to delete a message.
/// </summary>
public record DeleteMessageCommand : ICommand<Result>
{
    /// <summary>
    /// The ID of the message to delete.
    /// </summary>
    public int MessageId { get; init; }
}
