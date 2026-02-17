using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Admin.StaticSections.Commands.Create;

public record CreateStaticSectionLocalizationDto(
	string LocaleCode,
	string Title,
	string Subtitle,
	string Content,
	string? Metadata
);

public record CreateStaticSectionCommand(
	string Key,
	List<CreateStaticSectionLocalizationDto> Localizations,
	bool IsActive = true
) : ICommand<Result<int>>;
