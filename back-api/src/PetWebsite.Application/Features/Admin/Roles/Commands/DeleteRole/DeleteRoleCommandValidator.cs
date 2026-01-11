using FluentValidation;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Validators;
using PetWebsite.Domain.Constants;

namespace PetWebsite.Application.Features.Admin.Roles.Commands.DeleteRole;

/// <summary>
/// Validator for DeleteRoleCommand.
/// </summary>
public class DeleteRoleCommandValidator : BaseValidator<DeleteRoleCommand>
{
	public DeleteRoleCommandValidator(IStringLocalizer localizer)
		: base(localizer)
	{
		RuleFor(x => x.RoleId).NotEmpty().WithMessage(L(LocalizationKeys.Role.IdRequired));
	}
}
