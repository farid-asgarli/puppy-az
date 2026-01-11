using FluentValidation;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Validators;
using PetWebsite.Domain.Constants;

namespace PetWebsite.Application.Features.Admin.Users.Commands.CreateUser;

/// <summary>
/// Validator for CreateUserCommand.
/// </summary>
public class CreateUserCommandValidator : BaseValidator<CreateUserCommand>
{
	public CreateUserCommandValidator(IStringLocalizer localizer)
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
			.MinimumLength(8)
			.WithMessage(L(LocalizationKeys.Auth.PasswordTooShort, 8))
			.Matches(@"[A-Z]")
			.WithMessage(L(LocalizationKeys.Auth.PasswordRequiresUppercase))
			.Matches(@"[a-z]")
			.WithMessage(L(LocalizationKeys.Auth.PasswordRequiresLowercase))
			.Matches(@"[0-9]")
			.WithMessage(L(LocalizationKeys.Auth.PasswordRequiresDigit))
			.Matches(@"[\W_]")
			.WithMessage(L(LocalizationKeys.Auth.PasswordRequiresSpecialChar));

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
	}
}
