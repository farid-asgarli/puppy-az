using System.IdentityModel.Tokens.Jwt;
using PetWebsite.Application.Common.Interfaces;

namespace PetWebsite.API.Middleware;

/// <summary>
/// Middleware to check if JWT tokens are blacklisted.
/// This runs after authentication to invalidate tokens that have been logged out.
/// </summary>
public class TokenBlacklistMiddleware(RequestDelegate next, ILogger<TokenBlacklistMiddleware> logger)
{
	private readonly RequestDelegate _next = next;
	private readonly ILogger<TokenBlacklistMiddleware> _logger = logger;

	public async Task InvokeAsync(HttpContext context, ITokenBlacklistService tokenBlacklistService)
	{
		// Check if user is authenticated
		if (context.User.Identity?.IsAuthenticated == true)
		{
			try
			{
				// Extract the jti (JWT ID) claim from the token
				var jtiClaim = context.User.FindFirst(JwtRegisteredClaimNames.Jti);

				if (jtiClaim != null)
				{
					var tokenId = jtiClaim.Value;

					// Check if the token is blacklisted
					var isBlacklisted = await tokenBlacklistService.IsTokenBlacklistedAsync(tokenId, context.RequestAborted);

					if (isBlacklisted)
					{
						_logger.LogWarning("Blocked access attempt with blacklisted token: {TokenId}", tokenId);

						context.Response.StatusCode = StatusCodes.Status401Unauthorized;
						context.Response.ContentType = "application/json";
						await context.Response.WriteAsJsonAsync(
							new { error = "Token has been invalidated", message = "This token is no longer valid. Please log in again." }
						);
						return;
					}
				}
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error checking token blacklist status");
				// Continue processing to avoid blocking users on error
			}
		}

		await _next(context);
	}
}
