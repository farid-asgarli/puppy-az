using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;

namespace PetWebsite.API.Controllers.Base;

/// <summary>
/// Base API controller with common functionality for all controllers.
/// Provides access to MediatR, localization, and user claim helpers.
/// </summary>
/// <remarks>
/// Initializes a new instance of the BaseApiController.
/// </remarks>
/// <param name="mediator">MediatR instance</param>
/// <param name="localizer">String localizer instance</param>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
[Consumes("application/json")]
public abstract class BaseApiController(IMediator mediator, IStringLocalizer localizer) : ControllerBase
{
	/// <summary>
	/// MediatR for sending commands and queries.
	/// </summary>
	protected readonly IMediator Mediator = mediator;

	/// <summary>
	/// String localizer for translations.
	/// </summary>
	protected readonly IStringLocalizer Localizer = localizer;

	#region User Claims Helpers

	/// <summary>
	/// Gets the current user's ID from JWT claims.
	/// </summary>
	/// <returns>User ID if authenticated, null otherwise.</returns>
	protected Guid? GetUserId()
	{
		var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
		return Guid.TryParse(userIdClaim, out var userId) ? userId : null;
	}

	/// <summary>
	/// Gets the current user's email from JWT claims.
	/// </summary>
	/// <returns>User email if authenticated, null otherwise.</returns>
	protected string? GetUserEmail()
	{
		return User.FindFirstValue(ClaimTypes.Email);
	}

	/// <summary>
	/// Gets the current user's name from JWT claims.
	/// </summary>
	/// <returns>User name if authenticated, null otherwise.</returns>
	protected string? GetUserName()
	{
		return User.FindFirstValue(ClaimTypes.Name);
	}

	/// <summary>
	/// Gets all roles assigned to the current user.
	/// </summary>
	/// <returns>List of role names.</returns>
	protected IEnumerable<string> GetUserRoles()
	{
		return User.FindAll(ClaimTypes.Role).Select(c => c.Value);
	}

	/// <summary>
	/// Gets a specific claim value from the current user.
	/// </summary>
	/// <param name="claimType">The claim type to retrieve.</param>
	/// <returns>The claim value if found, null otherwise.</returns>
	protected string? GetClaim(string claimType)
	{
		return User.FindFirstValue(claimType);
	}

	/// <summary>
	/// Gets all claims of a specific type from the current user.
	/// </summary>
	/// <param name="claimType">The claim type to retrieve.</param>
	/// <returns>Collection of claim values.</returns>
	protected IEnumerable<string> GetClaims(string claimType)
	{
		return User.FindAll(claimType).Select(c => c.Value);
	}

	#endregion

	#region Role Validation Helpers

	/// <summary>
	/// Checks if the current user has a specific role.
	/// </summary>
	/// <param name="roleName">The role name to check.</param>
	/// <returns>True if user has the role, false otherwise.</returns>
	protected bool HasRole(string roleName)
	{
		return User.IsInRole(roleName);
	}

	/// <summary>
	/// Checks if the current user has any of the specified roles.
	/// </summary>
	/// <param name="roleNames">The role names to check.</param>
	/// <returns>True if user has any of the roles, false otherwise.</returns>
	protected bool HasAnyRole(params string[] roleNames)
	{
		return roleNames.Any(role => User.IsInRole(role));
	}

	/// <summary>
	/// Checks if the current user has all of the specified roles.
	/// </summary>
	/// <param name="roleNames">The role names to check.</param>
	/// <returns>True if user has all of the roles, false otherwise.</returns>
	protected bool HasAllRoles(params string[] roleNames)
	{
		return roleNames.All(role => User.IsInRole(role));
	}

	/// <summary>
	/// Checks if the current user is authenticated.
	/// </summary>
	/// <returns>True if user is authenticated, false otherwise.</returns>
	protected bool IsAuthenticated()
	{
		return User.Identity?.IsAuthenticated ?? false;
	}

	#endregion

	#region Standard Response Helpers

	/// <summary>
	/// Creates a standardized BadRequest response with a message.
	/// </summary>
	/// <param name="message">The error message.</param>
	/// <returns>BadRequest result.</returns>
	protected IActionResult BadRequestWithMessage(string message)
	{
		return BadRequest(new { error = message });
	}

	/// <summary>
	/// Creates a standardized NotFound response with a message.
	/// </summary>
	/// <param name="message">The error message.</param>
	/// <returns>NotFound result.</returns>
	protected IActionResult NotFoundWithMessage(string message)
	{
		return NotFound(new { error = message });
	}

	/// <summary>
	/// Creates a standardized Unauthorized response with a message.
	/// </summary>
	/// <param name="message">The error message.</param>
	/// <returns>Unauthorized result.</returns>
	protected IActionResult UnauthorizedWithMessage(string message)
	{
		return Unauthorized(new { error = message });
	}

	/// <summary>
	/// Creates a standardized Forbidden response with a message.
	/// </summary>
	/// <param name="message">The error message.</param>
	/// <returns>Forbid result with custom message.</returns>
	protected IActionResult ForbiddenWithMessage(string message)
	{
		return StatusCode(StatusCodes.Status403Forbidden, new { error = message });
	}

	#endregion
}
