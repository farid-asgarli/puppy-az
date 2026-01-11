using FluentValidation;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Validators;
using PetWebsite.Domain.Constants;

namespace PetWebsite.Application.Features.Users.Commands.ChangePassword;

public class ChangePasswordCommandValidator : BaseValidator<ChangePasswordCommand>
{
	public ChangePasswordCommandValidator(IStringLocalizer localizer)
		: base(localizer)
	{
		RuleFor(x => x.CurrentPassword).NotEmpty().WithMessage(L(LocalizationKeys.Auth.PasswordRequired));

		RuleFor(x => x.NewPassword)
			.NotEmpty()
			.WithMessage(L(LocalizationKeys.Auth.PasswordRequired))
			.MinimumLength(6)
			.WithMessage(L(LocalizationKeys.Auth.PasswordTooShort, 6))
			.Matches(@"[0-9]")
			.WithMessage(L(LocalizationKeys.Auth.PasswordRequiresDigit))
			.Matches(@"[a-z]")
			.WithMessage(L(LocalizationKeys.Auth.PasswordRequiresLowercase))
			.NotEqual(x => x.CurrentPassword)
			.WithMessage(L(LocalizationKeys.User.NewPasswordMustBeDifferent));
	}
}
