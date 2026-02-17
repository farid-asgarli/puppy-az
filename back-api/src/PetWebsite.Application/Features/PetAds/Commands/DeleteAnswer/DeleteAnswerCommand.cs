using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.PetAds.Commands.DeleteAnswer;

public record DeleteAnswerCommand : ICommand<Result<DeleteAnswerResultDto>>
{
	public int QuestionId { get; init; }
}

public record DeleteAnswerResultDto
{
	public int QuestionId { get; init; }
	public int PetAdId { get; init; }
}
