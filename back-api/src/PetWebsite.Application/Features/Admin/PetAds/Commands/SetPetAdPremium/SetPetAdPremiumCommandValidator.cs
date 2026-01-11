using FluentValidation;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Validators;
using PetWebsite.Domain.Constants;

namespace PetWebsite.Application.Features.Admin.PetAds.Commands.SetPetAdPremium;

public class SetPetAdPremiumCommandValidator : BaseValidator<SetPetAdPremiumCommand>
{
	public SetPetAdPremiumCommandValidator(IStringLocalizer localizer)
		: base(localizer)
	{
		RuleFor(x => x.Id).GreaterThan(0).WithMessage(L(LocalizationKeys.PetAd.IdInvalid));

		RuleFor(x => x.DurationInDays)
			.GreaterThan(0)
			.When(x => x.IsPremium)
			.WithMessage("Duration must be greater than 0 when setting premium status.");

		RuleFor(x => x.DurationInDays)
			.LessThanOrEqualTo(365)
			.When(x => x.IsPremium && x.DurationInDays.HasValue)
			.WithMessage("Duration cannot exceed 365 days.");
	}
}
