using FluentValidation;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Validators;
using PetWebsite.Domain.Constants;

namespace PetWebsite.Application.Features.Sms.Commands.SendSms;

/// <summary>
/// Validator for SendSmsCommand.
/// </summary>
public class SendSmsCommandValidator : BaseValidator<SendSmsCommand>
{
	public SendSmsCommandValidator(IStringLocalizer localizer)
		: base(localizer)
	{
		RuleFor(x => x.PhoneNumber)
			.NotEmpty()
			.WithMessage(L(LocalizationKeys.Sms.PhoneNumberRequired))
			.Matches(ValidationPatterns.AzerbaijaniPhoneNumber)
			.WithMessage(L(LocalizationKeys.Sms.InvalidPhoneNumber));

		RuleFor(x => x.Message)
			.NotEmpty()
			.WithMessage(L(LocalizationKeys.Sms.MessageRequired))
			.MaximumLength(500)
			.WithMessage(L(LocalizationKeys.Sms.MessageTooLong));
	}
}
