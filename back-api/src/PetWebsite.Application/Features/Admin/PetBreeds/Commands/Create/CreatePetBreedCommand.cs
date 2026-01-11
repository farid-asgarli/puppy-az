using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Admin.PetBreeds.Commands.Create;

public record CreatePetBreedLocalizationDto(string LocaleCode, string Title);

public record CreatePetBreedCommand(int PetCategoryId, List<CreatePetBreedLocalizationDto> Localizations, bool IsActive = true)
	: ICommand<Result<int>>;
