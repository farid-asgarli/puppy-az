using MediatR;
using Microsoft.AspNetCore.Identity;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Constants;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Application.Features.Admin.Roles.Commands.RemoveRoleFromUser;

/// <summary>
/// Handler for removing a role from a user.
/// </summary>
public class RemoveRoleFromUserCommandHandler(UserManager<AdminUser> userManager, RoleManager<IdentityRole<Guid>> roleManager)
	: IRequestHandler<RemoveRoleFromUserCommand, Result>
{
	private readonly UserManager<AdminUser> _userManager = userManager;
	private readonly RoleManager<IdentityRole<Guid>> _roleManager = roleManager;

	public async Task<Result> Handle(RemoveRoleFromUserCommand request, CancellationToken cancellationToken)
	{
		// Check if role exists
		if (!await _roleManager.RoleExistsAsync(request.RoleName))
		{
			return Result.NotFound("Role not found.");
		}

		// Find user
		var user = await _userManager.FindByIdAsync(request.UserId.ToString());
		if (user == null)
		{
			return Result.NotFound("User not found.");
		}

		// Check if user has the role
		if (!await _userManager.IsInRoleAsync(user, request.RoleName))
		{
			return Result.Failure("User does not have this role.", 400);
		}

		// Prevent removing SuperAdmin role from the last SuperAdmin
		if (request.RoleName == AdminRoles.SuperAdmin)
		{
			var superAdmins = await _userManager.GetUsersInRoleAsync(AdminRoles.SuperAdmin);
			if (superAdmins.Count == 1 && superAdmins[0].Id == user.Id)
			{
				return Result.Failure("Cannot remove SuperAdmin role from the last SuperAdmin user.", 400);
			}
		}

		// Remove role from user
		var result = await _userManager.RemoveFromRoleAsync(user, request.RoleName);

		if (!result.Succeeded)
		{
			var errors = string.Join(", ", result.Errors.Select(e => e.Description));
			return Result.Failure($"Failed to remove role: {errors}", 400);
		}

		return Result.Success();
	}
}

