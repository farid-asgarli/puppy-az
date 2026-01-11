using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using PetWebsite.API.Constants;
using PetWebsite.API.Controllers.Base;
using PetWebsite.API.Extensions;
using PetWebsite.API.Models.Requests.Admin;
using PetWebsite.Application.Features.Admin.Users.Commands.CreateUser;
using PetWebsite.Application.Features.Admin.Users.Commands.DeleteUser;
using PetWebsite.Application.Features.Admin.Users.Commands.UpdateUser;
using PetWebsite.Application.Features.Admin.Users.Queries.GetAllUsers;
using PetWebsite.Application.Features.Admin.Users.Queries.GetUserById;

namespace PetWebsite.API.Controllers.Admin;

/// <summary>
/// Controller for managing admin users.
/// </summary>
[Route("api/admin/user")]
[Authorize(Roles = $"{AuthorizationConstants.Roles.SuperAdmin},{AuthorizationConstants.Roles.Admin}")]
public class AdminUserController(IMediator mediator, IStringLocalizer<AdminUserController> localizer)
	: AdminBaseController(mediator, localizer)
{
	/// <summary>
	/// Get all admin users.
	/// </summary>
	[HttpGet]
	public async Task<IActionResult> GetAllUsers(CancellationToken cancellationToken)
	{
		var query = new GetAllUsersQuery();
		var result = await Mediator.Send(query, cancellationToken);
		return result.ToActionResult();
	}

	/// <summary>
	/// Get admin user by ID.
	/// </summary>
	[HttpGet("{userId}")]
	public async Task<IActionResult> GetUserById(Guid userId, CancellationToken cancellationToken)
	{
		var query = new GetUserByIdQuery(userId);
		var result = await Mediator.Send(query, cancellationToken);
		return result.ToActionResult();
	}

	/// <summary>
	/// Create a new admin user (SuperAdmin only).
	/// </summary>
	[HttpPost]
	[Authorize(Roles = AuthorizationConstants.Roles.SuperAdmin)]
	public async Task<IActionResult> CreateUser(CreateUserCommand command, CancellationToken cancellationToken)
	{
		var result = await Mediator.Send(command, cancellationToken);
		return result.ToActionResult();
	}

	/// <summary>
	/// Update an admin user.
	/// </summary>
	[HttpPut("{userId}")]
	public async Task<IActionResult> UpdateUser(Guid userId, [FromBody] UpdateUserRequest request, CancellationToken cancellationToken)
	{
		var command = new UpdateUserCommand(userId, request.FirstName, request.LastName, request.IsActive);
		var result = await Mediator.Send(command, cancellationToken);
		return result.ToActionResult();
	}

	/// <summary>
	/// Delete an admin user (SuperAdmin only).
	/// </summary>
	[HttpDelete("{userId}")]
	[Authorize(Roles = AuthorizationConstants.Roles.SuperAdmin)]
	public async Task<IActionResult> DeleteUser(Guid userId, CancellationToken cancellationToken)
	{
		var command = new DeleteUserCommand(userId);
		var result = await Mediator.Send(command, cancellationToken);
		return result.ToActionResult();
	}
}
