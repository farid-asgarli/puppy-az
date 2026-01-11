using FluentValidation;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Validators;
using PetWebsite.Domain.Constants;

namespace PetWebsite.Application.Features.Admin.Users.Commands.UpdateUser;

/// <summary>
/// Validator for UpdateUserCommand.
/// </summary>
public class UpdateUserCommandValidator : BaseValidator<UpdateUserCommand>
{
	public UpdateUserCommandValidator(IStringLocalizer localizer)
		: base(localizer)
	{
		RuleFor(x => x.UserId).NotEmpty().WithMessage(L(LocalizationKeys.User.IdInvalid));

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
