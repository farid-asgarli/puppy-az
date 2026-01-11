using FluentValidation;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Validators;
using PetWebsite.Domain.Constants;

namespace PetWebsite.Application.Features.PetAds.Commands.SubmitPetAd;

public class SubmitPetAdCommandValidator : BaseValidator<SubmitPetAdCommand>
{
	public SubmitPetAdCommandValidator(IStringLocalizer localizer)
		: base(localizer)
	{
		RuleFor(x => x.Title)
			.NotEmpty()
			.WithMessage(L(LocalizationKeys.PetAd.TitleRequired))
			.MaximumLength(200)
			.WithMessage(L(LocalizationKeys.PetAd.TitleMaxLength));

		RuleFor(x => x.Description)
			.NotEmpty()
			.WithMessage(L(LocalizationKeys.PetAd.DescriptionRequired))
			.MaximumLength(2000)
			.WithMessage(L(LocalizationKeys.PetAd.DescriptionMaxLength));

		RuleFor(x => x.AgeInMonths)
			.GreaterThanOrEqualTo(0)
			.WithMessage(L(LocalizationKeys.PetAd.AgeInvalid))
			.LessThanOrEqualTo(300)
			.WithMessage(L(LocalizationKeys.PetAd.AgeTooHigh)); // Max ~25 years

		RuleFor(x => x.Gender).IsInEnum().WithMessage(L(LocalizationKeys.PetAd.GenderInvalid));

		RuleFor(x => x.AdType).IsInEnum().WithMessage(L(LocalizationKeys.PetAd.AdTypeInvalid));

		RuleFor(x => x.Color)
			.NotEmpty()
			.WithMessage(L(LocalizationKeys.PetAd.ColorRequired))
			.MaximumLength(50)
			.WithMessage(L(LocalizationKeys.PetAd.ColorMaxLength));

		RuleFor(x => x.Weight)
			.GreaterThan(0)
			.WithMessage(L(LocalizationKeys.PetAd.WeightInvalid))
			.LessThan(500)
			.WithMessage(L(LocalizationKeys.PetAd.WeightTooHigh))
			.When(x => x.Weight.HasValue);

		RuleFor(x => x.Size).IsInEnum().WithMessage(L(LocalizationKeys.PetAd.SizeInvalid)).When(x => x.Size.HasValue);

		RuleFor(x => x.Price)
			.GreaterThanOrEqualTo(0)
			.WithMessage(L(LocalizationKeys.PetAd.PriceInvalid))
			.LessThan(1_000_000)
			.WithMessage(L(LocalizationKeys.PetAd.PriceTooHigh));

		RuleFor(x => x.CityId).GreaterThan(0).WithMessage(L(LocalizationKeys.PetAd.CityIdInvalid));

		RuleFor(x => x.PetBreedId).GreaterThan(0).WithMessage(L(LocalizationKeys.PetAd.BreedIdInvalid));

		RuleFor(x => x.ImageIds).Must(ids => ids == null || ids.Count <= 10).WithMessage(L(LocalizationKeys.PetAd.TooManyImages));

		RuleForEach(x => x.ImageIds).GreaterThan(0).WithMessage(L(LocalizationKeys.PetAd.ImageIdInvalid)).When(x => x.ImageIds is not null);
	}
}
