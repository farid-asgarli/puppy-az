using FluentValidation;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Validators;
using PetWebsite.Domain.Constants;

namespace PetWebsite.Application.Features.Admin.PetCategories.Commands.Update;

public class UpdatePetCategoryCommandValidator : BaseValidator<UpdatePetCategoryCommand>
{
	public UpdatePetCategoryCommandValidator(IStringLocalizer localizer)
		: base(localizer)
	{
		RuleFor(x => x.Id).GreaterThan(0).WithMessage(L(LocalizationKeys.PetCategory.IdInvalid));

		RuleFor(x => x.Localizations).NotEmpty().WithMessage(L(LocalizationKeys.PetCategory.LocalizationRequired));

		RuleForEach(x => x.Localizations)
			.ChildRules(loc =>
			{
				loc.RuleFor(l => l.LocaleCode)
					.NotEmpty()
					.WithMessage(L(LocalizationKeys.PetCategory.LocaleCodeRequired))
					.MaximumLength(10)
					.WithMessage(L(LocalizationKeys.PetCategory.LocaleCodeMaxLength));

				loc.RuleFor(l => l.Title)
					.NotEmpty()
					.WithMessage(L(LocalizationKeys.PetCategory.TitleRequired))
					.MaximumLength(100)
					.WithMessage(L(LocalizationKeys.PetCategory.TitleMaxLength));

				loc.RuleFor(l => l.Subtitle)
					.NotEmpty()
					.WithMessage(L(LocalizationKeys.PetCategory.SubtitleRequired))
					.MaximumLength(200)
					.WithMessage(L(LocalizationKeys.PetCategory.SubtitleMaxLength));
			});

		RuleFor(x => x.SvgIcon).NotEmpty().WithMessage(L(LocalizationKeys.PetCategory.SvgIconRequired));

		RuleFor(x => x.IconColor)
			.NotEmpty()
			.WithMessage(L(LocalizationKeys.PetCategory.IconColorRequired))
			.MaximumLength(50)
			.WithMessage(L(LocalizationKeys.PetCategory.IconColorMaxLength));

		RuleFor(x => x.BackgroundColor)
			.NotEmpty()
			.WithMessage(L(LocalizationKeys.PetCategory.BackgroundColorRequired))
			.MaximumLength(50)
			.WithMessage(L(LocalizationKeys.PetCategory.BackgroundColorMaxLength));
	}
}
