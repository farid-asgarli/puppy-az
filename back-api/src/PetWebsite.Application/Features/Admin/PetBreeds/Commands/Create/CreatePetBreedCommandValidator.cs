using FluentValidation;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Validators;
using PetWebsite.Domain.Constants;

namespace PetWebsite.Application.Features.Admin.PetBreeds.Commands.Create;

public class CreatePetBreedCommandValidator : BaseValidator<CreatePetBreedCommand>
{
	public CreatePetBreedCommandValidator(IStringLocalizer localizer)
		: base(localizer)
	{
		RuleFor(x => x.PetCategoryId).GreaterThan(0).WithMessage(L(LocalizationKeys.PetBreed.CategoryIdInvalid));

		RuleFor(x => x.Localizations).NotEmpty().WithMessage(L(LocalizationKeys.PetBreed.LocalizationRequired));

		RuleForEach(x => x.Localizations)
			.ChildRules(loc =>
			{
				loc.RuleFor(l => l.LocaleCode)
					.NotEmpty()
					.WithMessage(L(LocalizationKeys.PetBreed.LocaleCodeRequired))
					.MaximumLength(10)
					.WithMessage(L(LocalizationKeys.PetBreed.LocaleCodeMaxLength));

				loc.RuleFor(l => l.Title)
					.NotEmpty()
					.WithMessage(L(LocalizationKeys.PetBreed.TitleRequired))
					.MaximumLength(100)
					.WithMessage(L(LocalizationKeys.PetBreed.TitleMaxLength));
			});
	}
}
