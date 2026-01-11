using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Constants;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Application.Features.Users.Commands.UpdateProfile;

public class UpdateUserProfileCommandHandler(
	UserManager<User> userManager,
	ICurrentUserService currentUserService,
	IStringLocalizer localizer
) : BaseHandler(localizer), ICommandHandler<UpdateUserProfileCommand, Result>
{
	public async Task<Result> Handle(UpdateUserProfileCommand request, CancellationToken ct)
	{
		var userId = currentUserService.UserId;
		if (userId == null)
			return Result.Failure(L(LocalizationKeys.Error.Unauthorized), 401);

		var user = await userManager.FindByIdAsync(userId.ToString()!);
		if (user == null)
			return Result.Failure(L(LocalizationKeys.User.NotFound), 404);

		// Update user properties
		user.FirstName = request.FirstName;
		user.LastName = request.LastName;
		user.PhoneNumber = request.PhoneNumber;
		user.ProfilePictureUrl = request.ProfilePictureUrl;

		var updateResult = await userManager.UpdateAsync(user);
		if (!updateResult.Succeeded)
		{
			var errors = string.Join(", ", updateResult.Errors.Select(e => e.Description));
			return Result.Failure(errors, 400);
		}

		return Result.Success();
	}
}
