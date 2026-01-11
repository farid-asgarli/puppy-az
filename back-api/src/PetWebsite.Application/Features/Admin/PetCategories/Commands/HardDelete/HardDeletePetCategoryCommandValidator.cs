using FluentValidation;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Validators;
using PetWebsite.Domain.Constants;

namespace PetWebsite.Application.Features.Admin.PetCategories.Commands.HardDelete;

public class HardDeletePetCategoryCommandValidator : BaseValidator<HardDeletePetCategoryCommand>
{
	public HardDeletePetCategoryCommandValidator(IStringLocalizer localizer)
		: base(localizer)
	{
		RuleFor(x => x.Id).GreaterThan(0).WithMessage(L(LocalizationKeys.PetCategory.IdInvalid));
	}
}
