using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.PetAds.Commands.ReplyToQuestion;

public record ReplyToQuestionCommand : ICommand<Result<ReplyToQuestionResultDto>>
{
	public int QuestionId { get; init; }
	public string Text { get; init; } = null!;
}

public record ReplyToQuestionResultDto
{
	public int ReplyId { get; init; }
	public int QuestionId { get; init; }
	public int PetAdId { get; init; }
	public string QuestionerId { get; init; } = null!;
	public string UserName { get; init; } = null!;
	public string Text { get; init; } = null!;
	public bool IsOwnerReply { get; init; }
	public DateTime CreatedAt { get; init; }
}
