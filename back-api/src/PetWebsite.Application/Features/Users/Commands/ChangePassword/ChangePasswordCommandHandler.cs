using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Constants;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Application.Features.Users.Commands.ChangePassword;

public class ChangePasswordCommandHandler(UserManager<User> userManager, ICurrentUserService currentUserService, IStringLocalizer localizer)
	: BaseHandler(localizer),
		ICommandHandler<ChangePasswordCommand, Result>
{
	public async Task<Result> Handle(ChangePasswordCommand request, CancellationToken ct)
	{
		var userId = currentUserService.UserId;
		if (userId == null)
			return Result.Failure(L(LocalizationKeys.Error.Unauthorized), 401);

		var user = await userManager.FindByIdAsync(userId.ToString()!);
		if (user == null)
			return Result.Failure(L(LocalizationKeys.User.NotFound), 404);

		// Verify current password
		var isCurrentPasswordValid = await userManager.CheckPasswordAsync(user, request.CurrentPassword);
		if (!isCurrentPasswordValid)
			return Result.Failure(L(LocalizationKeys.Auth.InvalidCredentials), 400);

		// Change to new password
		var changePasswordResult = await userManager.ChangePasswordAsync(user, request.CurrentPassword, request.NewPassword);
		if (!changePasswordResult.Succeeded)
		{
			var errors = string.Join(", ", changePasswordResult.Errors.Select(e => e.Description));
			return Result.Failure(errors, 400);
		}

		return Result.Success();
	}
}
