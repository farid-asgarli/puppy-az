using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.PetAds.Commands.UpdateQuestion;

/// <summary>
/// Command to update a question on a pet advertisement.
/// Only the question author can update their question.
/// </summary>
public record UpdateQuestionCommand : ICommand<Result>
{
	public int QuestionId { get; init; }
	public string Question { get; init; } = null!;
}
