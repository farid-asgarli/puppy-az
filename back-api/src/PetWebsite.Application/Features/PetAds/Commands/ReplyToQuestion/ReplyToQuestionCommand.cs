using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.PetAds.Commands.ReplyToQuestion;

public record ReplyToQuestionCommand : ICommand<Result>
{
	public int QuestionId { get; init; }
	public string Text { get; init; } = null!;
}
