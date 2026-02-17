using FluentValidation;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Validators;
using PetWebsite.Domain.Constants;
using PetWebsite.Domain.Enums;

namespace PetWebsite.Application.Features.PetAds.Commands.UpdatePetAd;

public class UpdatePetAdCommandValidator : BaseValidator<UpdatePetAdCommand>
{
	// Ad types where breed and age are optional (Found, Owning)
	private static readonly PetAdType[] OptionalBreedAgeAdTypes = [PetAdType.Found, PetAdType.Owning];

	public UpdatePetAdCommandValidator(IStringLocalizer localizer)
		: base(localizer)
	{
		RuleFor(x => x.Id).GreaterThan(0).WithMessage(L(LocalizationKeys.PetAd.IdInvalid));

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

		// Age is always optional - user can skip it
		RuleFor(x => x.AgeInMonths)
			.GreaterThanOrEqualTo(0)
			.WithMessage(L(LocalizationKeys.PetAd.AgeInvalid))
			.LessThanOrEqualTo(300)
			.WithMessage(L(LocalizationKeys.PetAd.AgeTooHigh))
			.When(x => x.AgeInMonths.HasValue);

		// Gender is required for Sale, Lost, Match but optional for Found, Owning
		RuleFor(x => x.Gender)
			.NotNull()
			.WithMessage(L(LocalizationKeys.PetAd.GenderRequired))
			.When(x => !OptionalBreedAgeAdTypes.Contains(x.AdType));

		RuleFor(x => x.Gender)
			.IsInEnum()
			.WithMessage(L(LocalizationKeys.PetAd.GenderInvalid))
			.When(x => x.Gender.HasValue);

		RuleFor(x => x.AdType).IsInEnum().WithMessage(L(LocalizationKeys.PetAd.AdTypeInvalid));

		RuleFor(x => x.Color)
			.NotEmpty()
			.WithMessage(L(LocalizationKeys.PetAd.ColorRequired))
			.MaximumLength(50)
			.WithMessage(L(LocalizationKeys.PetAd.ColorMaxLength));

		RuleFor(x => x.Weight)
			.GreaterThan(0)
			.WithMessage(L(LocalizationKeys.PetAd.WeightInvalid))
			.When(x => x.Weight.HasValue);

		RuleFor(x => x.Size).IsInEnum().WithMessage(L(LocalizationKeys.PetAd.SizeInvalid)).When(x => x.Size.HasValue);

		RuleFor(x => x.Price)
			.GreaterThanOrEqualTo(0)
			.WithMessage(L(LocalizationKeys.PetAd.PriceInvalid))
			.LessThan(1_000_000)
			.WithMessage(L(LocalizationKeys.PetAd.PriceTooHigh));

		RuleFor(x => x.CityId).GreaterThan(0).WithMessage(L(LocalizationKeys.PetAd.CityIdInvalid));

		// Breed is required for Sale, Lost, Match but optional for Found, Owning
		// Also optional when user has suggested a new breed name
		RuleFor(x => x.PetBreedId)
			.NotNull()
			.WithMessage(L(LocalizationKeys.PetAd.BreedRequired))
			.When(x => !OptionalBreedAgeAdTypes.Contains(x.AdType) && string.IsNullOrWhiteSpace(x.SuggestedBreedName));

		RuleFor(x => x.PetBreedId)
			.GreaterThan(0)
			.WithMessage(L(LocalizationKeys.PetAd.BreedIdInvalid))
			.When(x => x.PetBreedId.HasValue);

		RuleFor(x => x.SuggestedBreedName)
			.MaximumLength(100)
			.WithMessage(L(LocalizationKeys.BreedSuggestion.NameMaxLength))
			.When(x => !string.IsNullOrWhiteSpace(x.SuggestedBreedName));

		RuleFor(x => x.CustomDistrictName)
			.MaximumLength(100)
			.When(x => !string.IsNullOrWhiteSpace(x.CustomDistrictName));

		RuleFor(x => x.ImageIds).Must(ids => ids == null || ids.Count <= 10).WithMessage(L(LocalizationKeys.PetAd.TooManyImages));

		RuleForEach(x => x.ImageIds).GreaterThan(0).WithMessage(L(LocalizationKeys.PetAd.ImageIdInvalid)).When(x => x.ImageIds is not null);
	}
}
