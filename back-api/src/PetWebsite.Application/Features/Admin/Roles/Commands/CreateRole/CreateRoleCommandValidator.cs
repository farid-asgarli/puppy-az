using FluentValidation;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Validators;
using PetWebsite.Domain.Constants;

namespace PetWebsite.Application.Features.Admin.Roles.Commands.CreateRole;

/// <summary>
/// Validator for CreateRoleCommand.
/// </summary>
public class CreateRoleCommandValidator : BaseValidator<CreateRoleCommand>
{
	public CreateRoleCommandValidator(IStringLocalizer localizer)
		: base(localizer)
	{
		RuleFor(x => x.RoleName)
			.NotEmpty()
			.WithMessage(L(LocalizationKeys.Role.NameRequired))
			.MaximumLength(100)
			.WithMessage(L(LocalizationKeys.Role.NameMaxLength, 100))
			.Matches("^[a-zA-Z0-9_-]+$")
			.WithMessage(L(LocalizationKeys.Role.InvalidCharacters));
	}
}
