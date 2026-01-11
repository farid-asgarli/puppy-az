using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using PetWebsite.API.Constants;
using PetWebsite.Domain.Constants;

namespace PetWebsite.API.Controllers.Base;

/// <summary>
/// Base controller for admin-only endpoints with authentication and authorization.
/// Provides additional helpers for authenticated admin operations.
/// </summary>
/// <remarks>
/// Initializes a new instance of the AdminBaseController.
/// </remarks>
/// <param name="mediator">MediatR instance</param>
/// <param name="localizer">String localizer instance</param>
[Authorize]
[ApiController]
[Route("api/admin/[controller]")]
[Produces("application/json")]
[Consumes("application/json")]
[ProducesResponseType(StatusCodes.Status401Unauthorized)]
[ProducesResponseType(StatusCodes.Status403Forbidden)]
public abstract class AdminBaseController(IMediator mediator, IStringLocalizer localizer) : BaseApiController(mediator, localizer)
{
	#region Authenticated User Helpers

	/// <summary>
	/// Gets the current authenticated admin user's ID.
	/// Throws if user is not authenticated.
	/// </summary>
	/// <returns>Admin user ID</returns>
	/// <exception cref="UnauthorizedAccessException">Thrown when user is not authenticated.</exception>
	protected Guid GetAuthenticatedUserId()
	{
		var userId = GetUserId();
		if (!userId.HasValue)
		{
			throw new UnauthorizedAccessException(Localizer[LocalizationKeys.Error.Unauthorized].Value);
		}
		return userId.Value;
	}

	/// <summary>
	/// Gets the current authenticated admin user's email.
	/// Throws if user is not authenticated.
	/// </summary>
	/// <returns>Admin user email</returns>
	/// <exception cref="UnauthorizedAccessException">Thrown when user is not authenticated.</exception>
	protected string GetAuthenticatedUserEmail()
	{
		var email = GetUserEmail();
		if (string.IsNullOrEmpty(email))
		{
			throw new UnauthorizedAccessException(Localizer[LocalizationKeys.Error.Unauthorized].Value);
		}
		return email;
	}

	/// <summary>
	/// Gets the current authenticated admin user's name.
	/// Throws if user is not authenticated.
	/// </summary>
	/// <returns>Admin user name</returns>
	/// <exception cref="UnauthorizedAccessException">Thrown when user is not authenticated.</exception>
	protected string GetAuthenticatedUserName()
	{
		var userName = GetUserName();
		if (string.IsNullOrEmpty(userName))
		{
			throw new UnauthorizedAccessException(Localizer[LocalizationKeys.Error.Unauthorized].Value);
		}
		return userName;
	}

	#endregion

	#region Authorization Validation Helpers

	/// <summary>
	/// Validates that the current user has the specified role.
	/// </summary>
	/// <param name="role">Role name to validate</param>
	/// <exception cref="UnauthorizedAccessException">Thrown when user doesn't have the required role.</exception>
	protected void RequireRole(string role)
	{
		if (!HasRole(role))
		{
			throw new UnauthorizedAccessException(Localizer[LocalizationKeys.Error.InsufficientPermissions, role].Value);
		}
	}

	/// <summary>
	/// Validates that the current user has at least one of the specified roles.
	/// </summary>
	/// <param name="roles">Roles to validate</param>
	/// <exception cref="UnauthorizedAccessException">Thrown when user doesn't have any of the required roles.</exception>
	protected void RequireAnyRole(params string[] roles)
	{
		if (!HasAnyRole(roles))
		{
			throw new UnauthorizedAccessException(
				Localizer[LocalizationKeys.Error.InsufficientPermissions, string.Join(", ", roles)].Value
			);
		}
	}

	/// <summary>
	/// Validates that the current user has all of the specified roles.
	/// </summary>
	/// <param name="roles">Roles to validate</param>
	/// <exception cref="UnauthorizedAccessException">Thrown when user doesn't have all of the required roles.</exception>
	protected void RequireAllRoles(params string[] roles)
	{
		if (!HasAllRoles(roles))
		{
			throw new UnauthorizedAccessException(
				Localizer[LocalizationKeys.Error.InsufficientPermissions, string.Join(", ", roles)].Value
			);
		}
	}

	/// <summary>
	/// Validates that the requesting user is either the resource owner or has admin privileges.
	/// </summary>
	/// <param name="resourceOwnerId">ID of the resource owner</param>
	/// <param name="adminRole">Admin role name (defaults to "Admin")</param>
	/// <exception cref="UnauthorizedAccessException">Thrown when user is neither the owner nor admin.</exception>
	protected void RequireOwnershipOrAdmin(Guid resourceOwnerId, string adminRole = AuthorizationConstants.Roles.Admin)
	{
		var currentUserId = GetAuthenticatedUserId();
		var isOwner = currentUserId == resourceOwnerId;
		var isAdmin = HasRole(adminRole);

		if (!isOwner && !isAdmin)
		{
			throw new UnauthorizedAccessException(Localizer[LocalizationKeys.Error.InsufficientPermissions].Value);
		}
	}

	#endregion

	#region Standardized Response Helpers

	/// <summary>
	/// Creates a standardized success response with data.
	/// </summary>
	/// <typeparam name="T">Type of the data</typeparam>
	/// <param name="data">Response data</param>
	/// <param name="message">Success message (optional)</param>
	/// <returns>200 OK response with data</returns>
	protected IActionResult SuccessResponse<T>(T data, string? message = null)
	{
		return Ok(
			new
			{
				success = true,
				message = message ?? Localizer[LocalizationKeys.Success.OperationCompleted].Value,
				data,
				timestamp = DateTime.UtcNow,
			}
		);
	}

	/// <summary>
	/// Creates a standardized success response without data.
	/// </summary>
	/// <param name="message">Success message (optional)</param>
	/// <returns>200 OK response</returns>
	protected IActionResult SuccessResponse(string? message = null)
	{
		return Ok(
			new
			{
				success = true,
				message = message ?? Localizer[LocalizationKeys.Success.OperationCompleted].Value,
				timestamp = DateTime.UtcNow,
			}
		);
	}

	/// <summary>
	/// Creates a standardized created response.
	/// </summary>
	/// <typeparam name="T">Type of the created resource</typeparam>
	/// <param name="routeName">Route name for the created resource</param>
	/// <param name="routeValues">Route values (typically includes id)</param>
	/// <param name="data">Created resource data</param>
	/// <param name="message">Success message (optional)</param>
	/// <returns>201 Created response</returns>
	protected IActionResult CreatedResponse<T>(string routeName, object routeValues, T data, string? message = null)
	{
		return CreatedAtRoute(
			routeName,
			routeValues,
			new
			{
				success = true,
				message = message ?? Localizer[LocalizationKeys.Success.ResourceCreated].Value,
				data,
				timestamp = DateTime.UtcNow,
			}
		);
	}

	/// <summary>
	/// Creates a standardized no content response.
	/// </summary>
	/// <returns>204 No Content response</returns>
	protected IActionResult NoContentResponse()
	{
		return NoContent();
	}

	#endregion
}
