using FluentValidation;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Validators;
using PetWebsite.Domain.Constants;

namespace PetWebsite.Application.Features.Auth.Commands.Register;

public class RegisterCommandValidator : BaseValidator<RegisterCommand>
{
	public RegisterCommandValidator(IStringLocalizer localizer)
		: base(localizer)
	{
		RuleFor(x => x.Email)
			.NotEmpty()
			.WithMessage(L(LocalizationKeys.Auth.EmailRequired))
			.EmailAddress()
			.WithMessage(L(LocalizationKeys.Auth.InvalidEmail));

		RuleFor(x => x.Password)
			.NotEmpty()
			.WithMessage(L(LocalizationKeys.Auth.PasswordRequired))
			.MinimumLength(6)
			.WithMessage(L(LocalizationKeys.Auth.PasswordTooShort, 6))
			.Matches(@"[0-9]")
			.WithMessage(L(LocalizationKeys.Auth.PasswordRequiresDigit))
			.Matches(@"[a-z]")
			.WithMessage(L(LocalizationKeys.Auth.PasswordRequiresLowercase));

		RuleFor(x => x.FirstName)
			.NotEmpty()
			.WithMessage(L(LocalizationKeys.User.FirstNameRequired))
			.MaximumLength(100)
			.WithMessage(L(LocalizationKeys.User.FirstNameMaxLength, 100));

		RuleFor(x => x.LastName)
			.NotEmpty()
			.WithMessage(L(LocalizationKeys.User.LastNameRequired))
			.MaximumLength(100)
			.WithMessage(L(LocalizationKeys.User.LastNameMaxLength, 100));

		RuleFor(x => x.PhoneNumber)
			.NotEmpty()
			.WithMessage(L(LocalizationKeys.User.PhoneNumberRequired))
			.Matches(ValidationPatterns.AzerbaijaniPhoneNumber)
			.WithMessage(L(LocalizationKeys.User.InvalidPhoneNumber));

		RuleFor(x => x.VerificationCode)
			.NotEmpty()
			.WithMessage(L(LocalizationKeys.Sms.VerificationCodeRequired))
			.Matches(ValidationPatterns.VerificationCode)
			.WithMessage(L(LocalizationKeys.Sms.InvalidVerificationCode));
	}
}
