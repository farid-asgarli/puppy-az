using MediatR;
using Microsoft.AspNetCore.Identity;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Constants;

namespace PetWebsite.Application.Features.Admin.Roles.Commands.DeleteRole;

/// <summary>
/// Handler for deleting a role.
/// </summary>
public class DeleteRoleCommandHandler(RoleManager<IdentityRole<Guid>> roleManager) : IRequestHandler<DeleteRoleCommand, Result>
{
	private readonly RoleManager<IdentityRole<Guid>> _roleManager = roleManager;

	public async Task<Result> Handle(DeleteRoleCommand request, CancellationToken cancellationToken)
	{
		var role = await _roleManager.FindByIdAsync(request.RoleId);
		if (role == null)
		{
			return Result.NotFound("Role not found.");
		}

		// Prevent deletion of system roles
		if (role.Name == AdminRoles.SuperAdmin || role.Name == AdminRoles.Admin || role.Name == AdminRoles.Moderator)
		{
			return Result.Failure("Cannot delete system roles.", 400);
		}

		var result = await _roleManager.DeleteAsync(role);

		if (!result.Succeeded)
		{
			var errors = string.Join(", ", result.Errors.Select(e => e.Description));
			return Result.Failure($"Failed to delete role: {errors}", 400);
		}

		return Result.Success();
	}
}

