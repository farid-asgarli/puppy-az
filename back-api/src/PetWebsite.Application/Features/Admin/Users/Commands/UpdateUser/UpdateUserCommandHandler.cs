using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Constants;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Application.Features.Admin.Users.Commands.UpdateUser;

/// <summary>
/// Handler for updating an admin user.
/// </summary>
public class UpdateUserCommandHandler(UserManager<AdminUser> userManager, IStringLocalizer localizer)
	: BaseHandler(localizer),
		IRequestHandler<UpdateUserCommand, Result>
{
	private readonly UserManager<AdminUser> _userManager = userManager;

	public async Task<Result> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
	{
		var user = await _userManager.FindByIdAsync(request.UserId.ToString());
		if (user == null)
		{
			return Result.NotFound(L(LocalizationKeys.User.NotFound));
		}

		user.FirstName = request.FirstName;
		user.LastName = request.LastName;
		user.IsActive = request.IsActive;

		var result = await _userManager.UpdateAsync(user);

		if (!result.Succeeded)
		{
			var errors = string.Join(", ", result.Errors.Select(e => e.Description));
			return Result.Failure(L(LocalizationKeys.User.UpdateFailed) + ": " + errors, 400);
		}

		return Result.Success();
	}
}
