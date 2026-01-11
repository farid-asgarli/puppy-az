using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Constants;

namespace PetWebsite.Application.Features.Admin.Roles.Commands.UpdateRole;

/// <summary>
/// Handler for updating a role.
/// </summary>
public class UpdateRoleCommandHandler(RoleManager<IdentityRole<Guid>> roleManager, IStringLocalizer localizer)
	: BaseHandler(localizer),
		IRequestHandler<UpdateRoleCommand, Result>
{
	private readonly RoleManager<IdentityRole<Guid>> _roleManager = roleManager;

	public async Task<Result> Handle(UpdateRoleCommand request, CancellationToken cancellationToken)
	{
		// Parse role ID
		if (!int.TryParse(request.RoleId, out var roleId))
		{
			return Result.Failure(L(LocalizationKeys.Role.IdInvalid), 400);
		}

		var role = await _roleManager.FindByIdAsync(request.RoleId);
		if (role == null)
		{
			return Result.NotFound(L(LocalizationKeys.Role.NotFound));
		}

		// Check if new name already exists
		var existingRole = await _roleManager.FindByNameAsync(request.NewRoleName);
		if (existingRole != null && existingRole.Id != role.Id)
		{
			return Result.Failure(L(LocalizationKeys.Role.NameAlreadyExists), 400);
		}

		role.Name = request.NewRoleName;
		var result = await _roleManager.UpdateAsync(role);

		if (!result.Succeeded)
		{
			var errors = string.Join(", ", result.Errors.Select(e => e.Description));
			return Result.Failure(L(LocalizationKeys.Role.UpdateFailed) + ": " + errors, 400);
		}

		return Result.Success();
	}
}

