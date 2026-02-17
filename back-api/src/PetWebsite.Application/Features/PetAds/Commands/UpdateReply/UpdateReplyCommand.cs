using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.PetAds.Commands.UpdateReply;

/// <summary>
/// Command to update a reply on a pet advertisement question.
/// Only the reply author can update their reply.
/// </summary>
public record UpdateReplyCommand : ICommand<Result>
{
	public int ReplyId { get; init; }
	public string Text { get; init; } = null!;
}
