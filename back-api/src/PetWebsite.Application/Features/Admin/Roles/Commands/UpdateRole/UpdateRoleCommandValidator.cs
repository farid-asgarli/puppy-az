using FluentValidation;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Validators;
using PetWebsite.Domain.Constants;

namespace PetWebsite.Application.Features.Admin.Roles.Commands.UpdateRole;

/// <summary>
/// Validator for UpdateRoleCommand.
/// </summary>
public class UpdateRoleCommandValidator : BaseValidator<UpdateRoleCommand>
{
	public UpdateRoleCommandValidator(IStringLocalizer localizer)
		: base(localizer)
	{
		RuleFor(x => x.RoleId).NotEmpty().WithMessage(L(LocalizationKeys.Role.IdRequired));

		RuleFor(x => x.NewRoleName)
			.NotEmpty()
			.WithMessage(L(LocalizationKeys.Role.NameRequired))
			.MaximumLength(100)
			.WithMessage(L(LocalizationKeys.Role.NameMaxLength, 100))
			.Matches("^[a-zA-Z0-9_-]+$")
			.WithMessage(L(LocalizationKeys.Role.InvalidCharacters));
	}
}
