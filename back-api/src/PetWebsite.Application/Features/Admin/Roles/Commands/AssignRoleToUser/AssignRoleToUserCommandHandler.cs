using MediatR;
using Microsoft.AspNetCore.Identity;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Application.Features.Admin.Roles.Commands.AssignRoleToUser;

/// <summary>
/// Handler for assigning a role to a user.
/// </summary>
public class AssignRoleToUserCommandHandler(UserManager<AdminUser> userManager, RoleManager<IdentityRole<Guid>> roleManager)
	: IRequestHandler<AssignRoleToUserCommand, Result>
{
	private readonly UserManager<AdminUser> _userManager = userManager;
	private readonly RoleManager<IdentityRole<Guid>> _roleManager = roleManager;

	public async Task<Result> Handle(AssignRoleToUserCommand request, CancellationToken cancellationToken)
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

		// Check if user already has the role
		if (await _userManager.IsInRoleAsync(user, request.RoleName))
		{
			return Result.Failure("User already has this role.", 400);
		}

		// Add role to user
		var result = await _userManager.AddToRoleAsync(user, request.RoleName);

		if (!result.Succeeded)
		{
			var errors = string.Join(", ", result.Errors.Select(e => e.Description));
			return Result.Failure($"Failed to assign role: {errors}", 400);
		}

		return Result.Success();
	}
}

