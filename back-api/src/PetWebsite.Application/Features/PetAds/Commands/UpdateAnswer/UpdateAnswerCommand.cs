using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.PetAds.Commands.UpdateAnswer;

/// <summary>
/// Command to update an answer on a pet advertisement question.
/// Only the ad owner (who answered) can update the answer.
/// </summary>
public record UpdateAnswerCommand : ICommand<Result>
{
	public int QuestionId { get; init; }
	public string Answer { get; init; } = null!;
}
