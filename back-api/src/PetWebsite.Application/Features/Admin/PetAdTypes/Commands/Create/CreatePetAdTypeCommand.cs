using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Admin.PetAdTypes.Commands.Create;

public record CreatePetAdTypeCommand(
	string Key,
	string Emoji,
	string? IconName,
	string BackgroundColor,
	string TextColor,
	string BorderColor,
	string TitleAz,
	string TitleEn,
	string TitleRu,
	string? DescriptionAz = null,
	string? DescriptionEn = null,
	string? DescriptionRu = null,
	int SortOrder = 100,
	bool IsActive = true
) : ICommand<Result<int>>;
