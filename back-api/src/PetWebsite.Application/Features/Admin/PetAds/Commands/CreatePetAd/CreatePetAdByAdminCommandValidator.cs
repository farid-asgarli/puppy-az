using FluentValidation;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Extensions;
using PetWebsite.Domain.Constants;
using PetWebsite.Domain.Enums;

namespace PetWebsite.Application.Features.Admin.PetAds.Commands.CreatePetAd;

public class CreatePetAdByAdminCommandValidator : AbstractValidator<CreatePetAdByAdminCommand>
{
	public CreatePetAdByAdminCommandValidator(IStringLocalizer localizer)
	{
		RuleFor(x => x.UserId)
			.NotEmpty().WithMessage(localizer[LocalizationKeys.Validation.Required]);

		RuleFor(x => x.Title)
			.NotEmpty().WithMessage(localizer[LocalizationKeys.Validation.Required])
			.MaximumLength(200).WithMessage(localizer[LocalizationKeys.Validation.MaxLength, 200]);

		RuleFor(x => x.Description)
			.NotEmpty().WithMessage(localizer[LocalizationKeys.Validation.Required])
			.MaximumLength(2000).WithMessage(localizer[LocalizationKeys.Validation.MaxLength, 2000]);

		RuleFor(x => x.AgeInMonths)
			.GreaterThanOrEqualTo(0).WithMessage(localizer[LocalizationKeys.Validation.GreaterThanOrEqual, 0])
			.When(x => x.AgeInMonths.HasValue);

		RuleFor(x => x.Gender)
			.IsInEnum().WithMessage(localizer[LocalizationKeys.Validation.Invalid])
			.When(x => x.Gender.HasValue);

		RuleFor(x => x.AdType)
			.IsInEnum().WithMessage(localizer[LocalizationKeys.Validation.Invalid]);

		RuleFor(x => x.Color)
			.NotEmpty().WithMessage(localizer[LocalizationKeys.Validation.Required])
			.MaximumLength(100).WithMessage(localizer[LocalizationKeys.Validation.MaxLength, 100]);

		RuleFor(x => x.Weight)
			.GreaterThan(0).WithMessage(localizer[LocalizationKeys.Validation.GreaterThan, 0])
			.When(x => x.Weight.HasValue);

		RuleFor(x => x.Size)
			.IsInEnum().WithMessage(localizer[LocalizationKeys.Validation.Invalid])
			.When(x => x.Size.HasValue);

		RuleFor(x => x.Price)
			.GreaterThanOrEqualTo(0).WithMessage(localizer[LocalizationKeys.Validation.GreaterThanOrEqual, 0]);

		RuleFor(x => x.CityId)
			.GreaterThan(0).WithMessage(localizer[LocalizationKeys.Validation.Required]);

		RuleFor(x => x.PetBreedId)
			.GreaterThan(0).WithMessage(localizer[LocalizationKeys.Validation.Required])
			.When(x => x.PetBreedId.HasValue);

		RuleFor(x => x.PetCategoryId)
			.GreaterThan(0).WithMessage(localizer[LocalizationKeys.Validation.Required])
			.When(x => x.PetCategoryId.HasValue);

		// Breed is required for certain ad types
		RuleFor(x => x.PetBreedId)
			.NotNull().WithMessage(localizer[LocalizationKeys.PetAd.BreedRequired])
			.When(x => x.AdType is PetAdType.Sale or PetAdType.Lost or PetAdType.Match);

		// Images validation
		RuleFor(x => x.ImageIds)
			.Must(ids => ids == null || ids.Count <= 10)
			.WithMessage(localizer[LocalizationKeys.PetAd.TooManyImages]);
	}
}
