using FluentValidation;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Validators;
using PetWebsite.Domain.Constants;

namespace PetWebsite.Application.Features.Admin.Roles.Commands.RemoveRoleFromUser;

/// <summary>
/// Validator for RemoveRoleFromUserCommand.
/// </summary>
public class RemoveRoleFromUserCommandValidator : BaseValidator<RemoveRoleFromUserCommand>
{
	public RemoveRoleFromUserCommandValidator(IStringLocalizer localizer)
		: base(localizer)
	{
		RuleFor(x => x.UserId).NotEmpty().WithMessage(L(LocalizationKeys.User.IdInvalid));

		RuleFor(x => x.RoleName).NotEmpty().WithMessage(L(LocalizationKeys.Role.NameRequired));
	}
}
