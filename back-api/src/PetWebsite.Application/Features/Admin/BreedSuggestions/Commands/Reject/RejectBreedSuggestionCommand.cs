using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Admin.BreedSuggestions.Commands.Reject;

public record RejectBreedSuggestionCommand(
	int SuggestionId,
	string? AdminNote = null
) : ICommand<Result>;
