using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.PetAds.Commands.DeleteQuestion;

/// <summary>
/// Command to delete a question on a pet advertisement.
/// Only the ad owner can delete questions on their ad.
/// </summary>
public record DeleteQuestionCommand : ICommand<Result>
{
	public int QuestionId { get; init; }
}
