using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.PetAds.Commands.AnswerQuestion;

/// <summary>
/// Command to answer a question on a pet advertisement.
/// Only the ad owner can answer questions on their ad.
/// </summary>
public record AnswerQuestionCommand : ICommand<Result<AnswerQuestionResultDto>>
{
	public int QuestionId { get; init; }
	public string Answer { get; init; } = null!;
}

/// <summary>
/// Result DTO containing information needed for SignalR notification
/// </summary>
public record AnswerQuestionResultDto
{
	public int QuestionId { get; init; }
	public int PetAdId { get; init; }
	public Guid QuestionerId { get; init; }
	public string Answer { get; init; } = null!;
	public DateTime AnsweredAt { get; init; }
}
