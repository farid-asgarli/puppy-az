using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.PetAds.Commands.AskQuestion;

/// <summary>
/// Command to ask a question on a pet advertisement.
/// </summary>
public record AskQuestionCommand : ICommand<Result>
{
	public int PetAdId { get; init; }
	public string Question { get; init; } = null!;
}
