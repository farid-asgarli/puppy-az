using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Admin.PetCategories.Commands.Create;

public record CreatePetCategoryLocalizationDto(string LocaleCode, string Title, string Subtitle);

public record CreatePetCategoryCommand(
	List<CreatePetCategoryLocalizationDto> Localizations,
	string SvgIcon,
	string IconColor,
	string BackgroundColor,
	bool IsActive = true
) : ICommand<Result<int>>;
