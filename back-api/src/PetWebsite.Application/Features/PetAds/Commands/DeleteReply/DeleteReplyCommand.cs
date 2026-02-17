using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.PetAds.Commands.DeleteReply;

/// <summary>
/// Command to delete a reply on a question.
/// Only the reply author can delete their reply.
/// </summary>
public record DeleteReplyCommand : ICommand<Result<DeleteReplyResultDto>>
{
	public int ReplyId { get; init; }
}

/// <summary>
/// Result DTO containing information needed for SignalR notification
/// </summary>
public record DeleteReplyResultDto
{
	public int ReplyId { get; init; }
	public int QuestionId { get; init; }
	public int PetAdId { get; init; }
}
