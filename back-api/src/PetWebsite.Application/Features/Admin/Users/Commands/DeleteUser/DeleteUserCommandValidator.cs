using FluentValidation;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Validators;
using PetWebsite.Domain.Constants;

namespace PetWebsite.Application.Features.Admin.Users.Commands.DeleteUser;

/// <summary>
/// Validator for DeleteUserCommand.
/// </summary>
public class DeleteUserCommandValidator : BaseValidator<DeleteUserCommand>
{
	public DeleteUserCommandValidator(IStringLocalizer localizer)
		: base(localizer)
	{
		RuleFor(x => x.UserId).NotEmpty().WithMessage(L(LocalizationKeys.User.IdInvalid));
	}
}
