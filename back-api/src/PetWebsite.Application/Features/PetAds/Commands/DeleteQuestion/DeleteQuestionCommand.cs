using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.PetAds.Commands.DeleteQuestion;

/// <summary>
/// Command to delete a question on a pet advertisement.
/// The ad owner or the question author can delete questions.
/// </summary>
public record DeleteQuestionCommand : ICommand<Result<DeleteQuestionResultDto>>
{
	public int QuestionId { get; init; }
}

/// <summary>
/// Result DTO containing information needed for SignalR notification
/// </summary>
public record DeleteQuestionResultDto
{
	public int QuestionId { get; init; }
	public int PetAdId { get; init; }
}
