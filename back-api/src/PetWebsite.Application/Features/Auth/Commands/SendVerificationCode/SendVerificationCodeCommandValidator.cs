using FluentValidation;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Validators;
using PetWebsite.Domain.Constants;

namespace PetWebsite.Application.Features.Auth.Commands.SendVerificationCode;

public class SendVerificationCodeCommandValidator : BaseValidator<SendVerificationCodeCommand>
{
	public SendVerificationCodeCommandValidator(IStringLocalizer localizer)
		: base(localizer)
	{
		RuleFor(x => x.PhoneNumber)
			.NotEmpty()
			.WithMessage(L(LocalizationKeys.User.PhoneNumberRequired))
			.Matches(ValidationPatterns.AzerbaijaniPhoneNumber)
			.WithMessage(L(LocalizationKeys.User.InvalidPhoneNumber));

		RuleFor(x => x.Purpose)
			.NotEmpty()
			.WithMessage(L(LocalizationKeys.Sms.PurposeRequired))
			.Must(x => x == "Registration" || x == "Login")
			.WithMessage(L(LocalizationKeys.Sms.InvalidPurpose));
	}
}
