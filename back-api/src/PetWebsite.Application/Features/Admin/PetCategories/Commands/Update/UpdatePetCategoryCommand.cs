using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Admin.PetCategories.Commands.Update;

public record UpdatePetCategoryLocalizationDto(int? Id, string LocaleCode, string Title, string Subtitle);

public record UpdatePetCategoryCommand(
	int Id,
	List<UpdatePetCategoryLocalizationDto> Localizations,
	string SvgIcon,
	string IconColor,
	string BackgroundColor,
	bool IsActive
) : ICommand<Result>;
