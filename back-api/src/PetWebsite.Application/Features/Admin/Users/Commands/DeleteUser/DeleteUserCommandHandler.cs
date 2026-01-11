using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Constants;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Application.Features.Admin.Users.Commands.DeleteUser;

/// <summary>
/// Handler for deleting an admin user.
/// </summary>
public class DeleteUserCommandHandler(UserManager<AdminUser> userManager, IStringLocalizer localizer)
	: BaseHandler(localizer),
		IRequestHandler<DeleteUserCommand, Result>
{
	private readonly UserManager<AdminUser> _userManager = userManager;

	public async Task<Result> Handle(DeleteUserCommand request, CancellationToken cancellationToken)
	{
		var user = await _userManager.FindByIdAsync(request.UserId.ToString());
		if (user == null)
		{
			return Result.NotFound(L(LocalizationKeys.User.NotFound));
		}

		// Prevent deletion of the last SuperAdmin
		var userRoles = await _userManager.GetRolesAsync(user);
		if (userRoles.Contains(AdminRoles.SuperAdmin))
		{
			var superAdmins = await _userManager.GetUsersInRoleAsync(AdminRoles.SuperAdmin);
			if (superAdmins.Count == 1)
			{
				return Result.Failure(L(LocalizationKeys.User.CannotDeleteLastSuperAdmin), 400);
			}
		}

		var result = await _userManager.DeleteAsync(user);

		if (!result.Succeeded)
		{
			var errors = string.Join(", ", result.Errors.Select(e => e.Description));
			return Result.Failure(L(LocalizationKeys.User.DeleteFailed) + ": " + errors, 400);
		}

		return Result.Success();
	}
}
