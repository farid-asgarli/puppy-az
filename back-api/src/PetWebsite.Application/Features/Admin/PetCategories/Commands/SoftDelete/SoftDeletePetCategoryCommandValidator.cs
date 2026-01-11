using FluentValidation;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Validators;
using PetWebsite.Domain.Constants;

namespace PetWebsite.Application.Features.Admin.PetCategories.Commands.SoftDelete;

public class SoftDeletePetCategoryCommandValidator : BaseValidator<SoftDeletePetCategoryCommand>
{
	public SoftDeletePetCategoryCommandValidator(IStringLocalizer localizer)
		: base(localizer)
	{
		RuleFor(x => x.Id).GreaterThan(0).WithMessage(L(LocalizationKeys.PetCategory.IdInvalid));

		// DeletedBy is now Guid?, no string validation needed
	}
}
