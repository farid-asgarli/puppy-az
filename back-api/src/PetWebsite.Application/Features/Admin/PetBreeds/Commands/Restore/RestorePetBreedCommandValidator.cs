using FluentValidation;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Validators;
using PetWebsite.Domain.Constants;

namespace PetWebsite.Application.Features.Admin.PetBreeds.Commands.Restore;

public class RestorePetBreedCommandValidator : BaseValidator<RestorePetBreedCommand>
{
	public RestorePetBreedCommandValidator(IStringLocalizer localizer)
		: base(localizer)
	{
		RuleFor(x => x.Id).GreaterThan(0).WithMessage(L(LocalizationKeys.PetBreed.IdInvalid));
	}
}
