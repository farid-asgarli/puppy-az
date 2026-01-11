using FluentValidation;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Validators;
using PetWebsite.Domain.Constants;

namespace PetWebsite.Application.Features.Auth.Commands.LoginWithMobile;

public class LoginWithMobileCommandValidator : BaseValidator<LoginWithMobileCommand>
{
	public LoginWithMobileCommandValidator(IStringLocalizer localizer)
		: base(localizer)
	{
		RuleFor(x => x.PhoneNumber)
			.NotEmpty()
			.WithMessage(L(LocalizationKeys.User.PhoneNumberRequired))
			.Matches(ValidationPatterns.AzerbaijaniPhoneNumber)
			.WithMessage(L(LocalizationKeys.User.InvalidPhoneNumber));

		RuleFor(x => x.VerificationCode)
			.NotEmpty()
			.WithMessage(L(LocalizationKeys.Sms.VerificationCodeRequired))
			.Length(6)
			.WithMessage(L(LocalizationKeys.Sms.InvalidVerificationCode));
	}
}
