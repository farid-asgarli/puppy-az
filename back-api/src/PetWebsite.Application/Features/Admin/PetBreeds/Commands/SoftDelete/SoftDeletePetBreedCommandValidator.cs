using FluentValidation;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Validators;
using PetWebsite.Domain.Constants;

namespace PetWebsite.Application.Features.Admin.PetBreeds.Commands.SoftDelete;

public class SoftDeletePetBreedCommandValidator : BaseValidator<SoftDeletePetBreedCommand>
{
	public SoftDeletePetBreedCommandValidator(IStringLocalizer localizer)
		: base(localizer)
	{
		RuleFor(x => x.Id).GreaterThan(0).WithMessage(L(LocalizationKeys.PetBreed.IdInvalid));
	}
}
