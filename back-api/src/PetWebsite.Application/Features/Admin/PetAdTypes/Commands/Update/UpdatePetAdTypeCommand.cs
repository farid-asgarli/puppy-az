using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Admin.PetAdTypes.Commands.Update;

public record UpdatePetAdTypeCommand(
	int Id,
	string Key,
	string Emoji,
	string? IconName,
	string BackgroundColor,
	string TextColor,
	string BorderColor,
	string TitleAz,
	string TitleEn,
	string TitleRu,
	string? DescriptionAz,
	string? DescriptionEn,
	string? DescriptionRu,
	int SortOrder,
	bool IsActive
) : ICommand<Result>;
