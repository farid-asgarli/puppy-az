using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Admin.StaticSections.Commands.Update;

public record UpdateStaticSectionLocalizationDto(
	string LocaleCode,
	string Title,
	string Subtitle,
	string Content,
	string? Metadata
);

public record UpdateStaticSectionCommand(
	int Id,
	string Key,
	List<UpdateStaticSectionLocalizationDto> Localizations,
	bool IsActive = true
) : ICommand<Result>;
