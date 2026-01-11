using FluentValidation;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Validators;
using PetWebsite.Domain.Constants;

namespace PetWebsite.Application.Features.PetAds.Commands.ClosePetAd;

public class ClosePetAdCommandValidator : BaseValidator<ClosePetAdCommand>
{
	public ClosePetAdCommandValidator(IStringLocalizer localizer)
		: base(localizer)
	{
		RuleFor(x => x.Id).GreaterThan(0).WithMessage(L(LocalizationKeys.PetAd.IdInvalid));
	}
}
