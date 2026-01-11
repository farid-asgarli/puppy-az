using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using PetWebsite.API.Constants;
using PetWebsite.API.Controllers.Base;
using PetWebsite.API.Extensions;
using PetWebsite.Application.Common.Models;
using PetWebsite.Application.Features.Admin.Auth.Commands.Login;
using PetWebsite.Application.Features.Admin.Auth.Commands.Logout;
using PetWebsite.Application.Features.Admin.Auth.Commands.RefreshToken;
using PetWebsite.Application.Features.Admin.Auth.Commands.Register;

namespace PetWebsite.API.Controllers.Admin;

/// <summary>
/// Authentication controller for admin users.
/// </summary>
[AllowAnonymous]
[ApiController]
[Route("api/admin/auth")]
[Produces("application/json")]
public class AdminAuthController(IMediator mediator, IStringLocalizer<AdminAuthController> localizer)
	: BaseApiController(mediator, localizer)
{
	/// <summary>
	/// Admin login endpoint.
	/// </summary>
	[HttpPost("login")]
	[ProducesResponseType(typeof(AuthenticationResponse), StatusCodes.Status200OK)]
	[ProducesResponseType(StatusCodes.Status400BadRequest)]
	public async Task<IActionResult> Login(LoginCommand command, CancellationToken cancellationToken)
	{
		var result = await Mediator.Send(command, cancellationToken);
		return result.ToActionResult();
	}

	/// <summary>
	/// Register a new admin user (SuperAdmin only).
	/// </summary>
	[HttpPost("register")]
	[Authorize(Roles = AuthorizationConstants.Roles.SuperAdmin)]
	[ProducesResponseType(typeof(AuthenticationResponse), StatusCodes.Status201Created)]
	[ProducesResponseType(StatusCodes.Status400BadRequest)]
	public async Task<IActionResult> Register(RegisterCommand command, CancellationToken cancellationToken)
	{
		var result = await Mediator.Send(command, cancellationToken);
		return result.ToActionResult();
	}

	/// <summary>
	/// Refresh access token using refresh token.
	/// </summary>
	[HttpPost("refresh-token")]
	[AllowAnonymous]
	public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenCommand command, CancellationToken cancellationToken)
	{
		var result = await Mediator.Send(command, cancellationToken);
		return result.ToActionResult();
	}

	/// <summary>
	/// Admin logout endpoint - invalidates the current access token and refresh token.
	/// </summary>
	[HttpPost("logout")]
	[Authorize]
	[ProducesResponseType(StatusCodes.Status200OK)]
	[ProducesResponseType(StatusCodes.Status401Unauthorized)]
	public async Task<IActionResult> Logout(CancellationToken cancellationToken)
	{
		var result = await Mediator.Send(new AdminLogoutCommand(), cancellationToken);

		if (result.IsSuccess)
			return Ok(new { message = "Logged out successfully" });

		return result.ToActionResult();
	}

	/// <summary>
	/// Get current user info (authenticated users only).
	/// </summary>
	[HttpGet("me")]
	[Authorize]
	public IActionResult GetCurrentUser()
	{
		var userId = GetUserId();
		var email = GetUserEmail();
		var firstName = GetClaim("firstName");
		var lastName = GetClaim("lastName");
		var roles = GetUserRoles().ToArray();

		return Ok(
			new
			{
				userId,
				email,
				firstName,
				lastName,
				roles,
			}
		);
	}
}
