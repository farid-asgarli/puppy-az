using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Admin.PetBreeds.Commands.Update;

public record UpdatePetBreedLocalizationDto(int? Id, string LocaleCode, string Title);

public record UpdatePetBreedCommand(int Id, int PetCategoryId, List<UpdatePetBreedLocalizationDto> Localizations, bool IsActive)
	: ICommand<Result>;
