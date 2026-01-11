using FluentValidation;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Validators;
using PetWebsite.Domain.Constants;

namespace PetWebsite.Application.Features.Admin.Auth.Commands.Login;

public class LoginCommandValidator : BaseValidator<LoginCommand>
{
	public LoginCommandValidator(IStringLocalizer localizer)
		: base(localizer)
	{
		RuleFor(x => x.Email)
			.NotEmpty()
			.WithMessage(L(LocalizationKeys.Auth.EmailRequired))
			.EmailAddress()
			.WithMessage(L(LocalizationKeys.Auth.InvalidEmail));

		RuleFor(x => x.Password).NotEmpty().WithMessage(L(LocalizationKeys.Auth.PasswordRequired));
	}
}
