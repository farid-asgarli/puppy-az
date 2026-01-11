using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using PetWebsite.API.Constants;
using PetWebsite.API.Controllers.Base;
using PetWebsite.API.Extensions;
using PetWebsite.API.Models.Requests.Admin;
using PetWebsite.Application.Features.Admin.Roles.Commands.AssignRoleToUser;
using PetWebsite.Application.Features.Admin.Roles.Commands.CreateRole;
using PetWebsite.Application.Features.Admin.Roles.Commands.DeleteRole;
using PetWebsite.Application.Features.Admin.Roles.Commands.RemoveRoleFromUser;
using PetWebsite.Application.Features.Admin.Roles.Commands.UpdateRole;
using PetWebsite.Application.Features.Admin.Roles.Queries.GetAllRoles;
using PetWebsite.Application.Features.Admin.Roles.Queries.GetRoleById;
using PetWebsite.Application.Features.Admin.Roles.Queries.GetUserRoles;

namespace PetWebsite.API.Controllers.Admin;

/// <summary>
/// Controller for managing roles and role assignments.
/// </summary>
[Route("api/admin/role")]
[Authorize(Roles = $"{AuthorizationConstants.Roles.SuperAdmin},{AuthorizationConstants.Roles.Admin}")]
public class AdminRoleController(IMediator mediator, IStringLocalizer<AdminRoleController> localizer)
	: AdminBaseController(mediator, localizer)
{
	/// <summary>
	/// Get all roles.
	/// </summary>
	[HttpGet]
	public async Task<IActionResult> GetAllRoles(CancellationToken cancellationToken)
	{
		var query = new GetAllRolesQuery();
		var result = await Mediator.Send(query, cancellationToken);
		return result.ToActionResult();
	}

	/// <summary>
	/// Get role by ID.
	/// </summary>
	[HttpGet("{roleId}")]
	public async Task<IActionResult> GetRoleById(string roleId, CancellationToken cancellationToken)
	{
		var query = new GetRoleByIdQuery(roleId);
		var result = await Mediator.Send(query, cancellationToken);
		return result.ToActionResult();
	}

	/// <summary>
	/// Create a new role (SuperAdmin only).
	/// </summary>
	[HttpPost]
	[Authorize(Roles = AuthorizationConstants.Roles.SuperAdmin)]
	public async Task<IActionResult> CreateRole(CreateRoleCommand command, CancellationToken cancellationToken)
	{
		var result = await Mediator.Send(command, cancellationToken);
		return result.ToActionResult();
	}

	/// <summary>
	/// Update a role (SuperAdmin only).
	/// </summary>
	[HttpPut("{roleId}")]
	[Authorize(Roles = AuthorizationConstants.Roles.SuperAdmin)]
	public async Task<IActionResult> UpdateRole(string roleId, [FromBody] UpdateRoleRequest request, CancellationToken cancellationToken)
	{
		var command = new UpdateRoleCommand(roleId, request.NewRoleName);
		var result = await Mediator.Send(command, cancellationToken);
		return result.ToActionResult();
	}

	/// <summary>
	/// Delete a role (SuperAdmin only).
	/// </summary>
	[HttpDelete("{roleId}")]
	[Authorize(Roles = AuthorizationConstants.Roles.SuperAdmin)]
	public async Task<IActionResult> DeleteRole(string roleId, CancellationToken cancellationToken)
	{
		var command = new DeleteRoleCommand(roleId);
		var result = await Mediator.Send(command, cancellationToken);
		return result.ToActionResult();
	}

	/// <summary>
	/// Get all roles for a specific user.
	/// </summary>
	[HttpGet("user/{userId}")]
	public async Task<IActionResult> GetUserRoles(Guid userId, CancellationToken cancellationToken)
	{
		var query = new GetUserRolesQuery(userId);
		var result = await Mediator.Send(query, cancellationToken);
		return result.ToActionResult();
	}

	/// <summary>
	/// Assign a role to a user (SuperAdmin only).
	/// </summary>
	[HttpPost("user/{userId}/assign")]
	[Authorize(Roles = AuthorizationConstants.Roles.SuperAdmin)]
	public async Task<IActionResult> AssignRoleToUser(
		Guid userId,
		[FromBody] AssignRoleRequest request,
		CancellationToken cancellationToken
	)
	{
		var command = new AssignRoleToUserCommand(userId, request.RoleName);
		var result = await Mediator.Send(command, cancellationToken);
		return result.ToActionResult();
	}

	/// <summary>
	/// Remove a role from a user (SuperAdmin only).
	/// </summary>
	[HttpPost("user/{userId}/remove")]
	[Authorize(Roles = AuthorizationConstants.Roles.SuperAdmin)]
	public async Task<IActionResult> RemoveRoleFromUser(
		Guid userId,
		[FromBody] RemoveRoleRequest request,
		CancellationToken cancellationToken
	)
	{
		var command = new RemoveRoleFromUserCommand(userId, request.RoleName);
		var result = await Mediator.Send(command, cancellationToken);
		return result.ToActionResult();
	}
}
