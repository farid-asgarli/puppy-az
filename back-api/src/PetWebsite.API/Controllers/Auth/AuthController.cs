using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using PetWebsite.API.Controllers.Base;
using PetWebsite.API.Extensions;
using PetWebsite.Application.Common.Models;
using PetWebsite.Application.Features.Auth.Commands.Login;
using PetWebsite.Application.Features.Auth.Commands.LoginWithMobile;
using PetWebsite.Application.Features.Auth.Commands.Logout;
using PetWebsite.Application.Features.Auth.Commands.RefreshToken;
using PetWebsite.Application.Features.Auth.Commands.Register;
using PetWebsite.Application.Features.Auth.Commands.SendVerificationCode;

namespace PetWebsite.API.Controllers.Auth;

/// <summary>
/// Authentication controller for regular users (consumers).
/// </summary>
[AllowAnonymous]
[ApiController]
[Route("api/auth")]
[Produces("application/json")]
public class AuthController(IMediator mediator, IStringLocalizer<AuthController> localizer) : BaseApiController(mediator, localizer)
{
	/// <summary>
	/// Send SMS verification code to a phone number.
	/// </summary>
	/// <param name="command">Phone number and purpose to send verification code for</param>
	/// <param name="cancellationToken">Cancellation token</param>
	/// <returns>Success result</returns>
	[HttpPost("send-verification-code")]
	[ProducesResponseType(StatusCodes.Status200OK)]
	[ProducesResponseType(StatusCodes.Status400BadRequest)]
	[ProducesResponseType(StatusCodes.Status429TooManyRequests)]
	public async Task<IActionResult> SendVerificationCode(SendVerificationCodeCommand command, CancellationToken cancellationToken)
	{
		var result = await Mediator.Send(command, cancellationToken);
		return result.ToActionResult();
	}

	/// <summary>
	/// Register a new user account.
	/// </summary>
	/// <param name="command">Registration details</param>
	/// <param name="cancellationToken">Cancellation token</param>
	/// <returns>Authentication response with tokens</returns>
	[HttpPost("register")]
	[ProducesResponseType(typeof(AuthenticationResponse), StatusCodes.Status201Created)]
	[ProducesResponseType(StatusCodes.Status400BadRequest)]
	public async Task<IActionResult> Register(RegisterCommand command, CancellationToken cancellationToken)
	{
		var result = await Mediator.Send(command, cancellationToken);

		if (result.IsSuccess)
		{
			// Set HttpOnly cookie for refresh token
			SetRefreshTokenCookie(result.Data!.RefreshToken);

			// Return access token in response body for Next.js to store
			return CreatedAtAction(nameof(GetCurrentUser), new { id = result.Data.UserId }, result.Data);
		}

		return result.ToActionResult();
	}

	/// <summary>
	/// Login with email and password.
	/// </summary>
	/// <param name="command">Login credentials</param>
	/// <param name="cancellationToken">Cancellation token</param>
	/// <returns>Authentication response with tokens</returns>
	[HttpPost("login-with-email")]
	[ProducesResponseType(typeof(AuthenticationResponse), StatusCodes.Status200OK)]
	[ProducesResponseType(StatusCodes.Status401Unauthorized)]
	public async Task<IActionResult> LoginWithEmail(LoginWithEmailCommand command, CancellationToken cancellationToken)
	{
		var result = await Mediator.Send(command, cancellationToken);

		if (result.IsSuccess)
		{
			// Set HttpOnly cookie for refresh token
			SetRefreshTokenCookie(result.Data!.RefreshToken);
		}

		return result.ToActionResult();
	}

	/// <summary>
	/// Login with mobile number and SMS verification code.
	/// </summary>
	/// <param name="command">Phone number and verification code</param>
	/// <param name="cancellationToken">Cancellation token</param>
	/// <returns>Authentication response with tokens</returns>
	[HttpPost("login-with-mobile")]
	[ProducesResponseType(typeof(AuthenticationResponse), StatusCodes.Status200OK)]
	[ProducesResponseType(StatusCodes.Status400BadRequest)]
	[ProducesResponseType(StatusCodes.Status404NotFound)]
	public async Task<IActionResult> LoginWithMobile(LoginWithMobileCommand command, CancellationToken cancellationToken)
	{
		var result = await Mediator.Send(command, cancellationToken);

		if (result.IsSuccess)
		{
			// Set HttpOnly cookie for refresh token
			SetRefreshTokenCookie(result.Data!.RefreshToken);
		}

		return result.ToActionResult();
	}

	/// <summary>
	/// Refresh access token using the refresh token from cookie.
	/// </summary>
	/// <param name="cancellationToken">Cancellation token</param>
	/// <returns>New authentication tokens</returns>
	[HttpPost("refresh")]
	[ProducesResponseType(typeof(AuthenticationResponse), StatusCodes.Status200OK)]
	[ProducesResponseType(StatusCodes.Status401Unauthorized)]
	public async Task<IActionResult> RefreshToken(CancellationToken cancellationToken)
	{
		// Get refresh token from cookie
		var refreshToken = Request.Cookies["refreshToken"];

		if (string.IsNullOrEmpty(refreshToken))
		{
			return Unauthorized(new { message = "Refresh token not found" });
		}

		var command = new RefreshTokenCommand(refreshToken);
		var result = await Mediator.Send(command, cancellationToken);

		if (result.IsSuccess)
		{
			// Update HttpOnly cookie with new refresh token
			SetRefreshTokenCookie(result.Data!.RefreshToken);
		}

		return result.ToActionResult();
	}

	/// <summary>
	/// Logout current user and invalidate refresh token.
	/// </summary>
	/// <param name="cancellationToken">Cancellation token</param>
	/// <returns>Success response</returns>
	[HttpPost("logout")]
	[Authorize]
	[ProducesResponseType(StatusCodes.Status200OK)]
	[ProducesResponseType(StatusCodes.Status401Unauthorized)]
	public async Task<IActionResult> Logout(CancellationToken cancellationToken)
	{
		var command = new LogoutCommand();
		var result = await Mediator.Send(command, cancellationToken);

		if (result.IsSuccess)
		{
			// Clear refresh token cookie
			Response.Cookies.Delete("refreshToken");
		}

		return result.ToActionResult();
	}

	/// <summary>
	/// Get current authenticated user information.
	/// </summary>
	/// <returns>Current user details</returns>
	[HttpGet("me")]
	[Authorize]
	[ProducesResponseType(StatusCodes.Status200OK)]
	[ProducesResponseType(StatusCodes.Status401Unauthorized)]
	public IActionResult GetCurrentUser()
	{
		var userId = GetUserId();
		var email = GetUserEmail();
		var userName = GetUserName();
		var roles = GetUserRoles().ToArray();
		var userType = GetClaim("user_type");

		return Ok(
			new
			{
				userId,
				email,
				userName,
				roles,
				userType,
			}
		);
	}

	/// <summary>
	/// Sets the refresh token as an HttpOnly cookie for secure storage.
	/// </summary>
	/// <param name="refreshToken">The refresh token to store</param>
	private void SetRefreshTokenCookie(string refreshToken)
	{
		var cookieOptions = new CookieOptions
		{
			HttpOnly = true,
			Secure = true, // Set to true in production (requires HTTPS)
			SameSite = SameSiteMode.Strict, // Adjust based on your Next.js deployment
			Expires = DateTime.UtcNow.AddDays(7), // Match refresh token expiration
			Path = "/",
			Domain = null, // Set this if you have specific domain requirements
		};

		Response.Cookies.Append("refreshToken", refreshToken, cookieOptions);
	}
}
