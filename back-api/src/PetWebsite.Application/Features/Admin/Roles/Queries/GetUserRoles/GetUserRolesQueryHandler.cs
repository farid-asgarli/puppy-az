using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Constants;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Application.Features.Admin.Roles.Queries.GetUserRoles;

/// <summary>
/// Handler for getting user roles.
/// </summary>
public class GetUserRolesQueryHandler(UserManager<AdminUser> userManager, IStringLocalizer localizer)
	: BaseHandler(localizer),
		IRequestHandler<GetUserRolesQuery, Result<List<string>>>
{
	private readonly UserManager<AdminUser> _userManager = userManager;

	public async Task<Result<List<string>>> Handle(GetUserRolesQuery request, CancellationToken cancellationToken)
	{
		var user = await _userManager.FindByIdAsync(request.UserId.ToString());
		if (user == null)
		{
			return Result<List<string>>.NotFound(L(LocalizationKeys.User.NotFound));
		}

		var roles = await _userManager.GetRolesAsync(user);
		return Result<List<string>>.Success([.. roles]);
	}
}

