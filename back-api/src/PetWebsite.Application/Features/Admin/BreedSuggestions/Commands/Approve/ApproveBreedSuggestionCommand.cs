using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Application.Features.Admin.PetBreeds.Commands.Create;

namespace PetWebsite.Application.Features.Admin.BreedSuggestions.Commands.Approve;

public record ApproveBreedSuggestionCommand(
	int SuggestionId,
	int PetCategoryId,
	List<CreatePetBreedLocalizationDto> Localizations,
	bool IsActive = true
) : ICommand<Result<int>>;
