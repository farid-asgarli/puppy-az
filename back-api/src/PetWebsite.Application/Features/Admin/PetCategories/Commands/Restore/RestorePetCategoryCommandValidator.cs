using FluentValidation;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Validators;
using PetWebsite.Domain.Constants;

namespace PetWebsite.Application.Features.Admin.PetCategories.Commands.Restore;

public class RestorePetCategoryCommandValidator : BaseValidator<RestorePetCategoryCommand>
{
	public RestorePetCategoryCommandValidator(IStringLocalizer localizer)
		: base(localizer)
	{
		RuleFor(x => x.Id).GreaterThan(0).WithMessage(L(LocalizationKeys.PetCategory.IdInvalid));
	}
}
