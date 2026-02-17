using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.PetAds.Commands.AskQuestion;

/// <summary>
/// Command to ask a question on a pet advertisement.
/// </summary>
public record AskQuestionCommand : ICommand<Result<AskQuestionResultDto>>
{
	public int PetAdId { get; init; }
	public string Question { get; init; } = null!;
}

/// <summary>
/// Result DTO for ask question command
/// </summary>
public record AskQuestionResultDto
{
	public int QuestionId { get; init; }
	public Guid OwnerId { get; init; }
	public string PetAdTitle { get; init; } = null!;
	public string QuestionerName { get; init; } = null!;
	public string QuestionText { get; init; } = null!;
}
