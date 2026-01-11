using FluentValidation;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Validators;
using PetWebsite.Domain.Constants;

namespace PetWebsite.Application.Features.Admin.PetBreeds.Commands.HardDelete;

public class HardDeletePetBreedCommandValidator : BaseValidator<HardDeletePetBreedCommand>
{
	public HardDeletePetBreedCommandValidator(IStringLocalizer localizer)
		: base(localizer)
	{
		RuleFor(x => x.Id).GreaterThan(0).WithMessage(L(LocalizationKeys.PetBreed.IdInvalid));
	}
}
