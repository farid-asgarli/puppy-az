using FluentValidation;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Validators;
using PetWebsite.Domain.Constants;

namespace PetWebsite.Application.Features.Admin.PetAds.Commands.SetPetAdVip;

public class SetPetAdVipCommandValidator : BaseValidator<SetPetAdVipCommand>
{
	public SetPetAdVipCommandValidator(IStringLocalizer localizer)
		: base(localizer)
	{
		RuleFor(x => x.Id).GreaterThan(0).WithMessage(L(LocalizationKeys.PetAd.IdInvalid));

		RuleFor(x => x.DurationInDays)
			.GreaterThan(0)
			.When(x => x.IsVip)
			.WithMessage("Duration must be greater than 0 when setting VIP status.");

		RuleFor(x => x.DurationInDays)
			.LessThanOrEqualTo(365)
			.When(x => x.IsVip && x.DurationInDays.HasValue)
			.WithMessage("Duration cannot exceed 365 days.");
	}
}
