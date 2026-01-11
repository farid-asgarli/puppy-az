using Microsoft.AspNetCore.Identity;

namespace PetWebsite.Application.Common.Interfaces;

/// <summary>
/// Service for generating and validating JWT tokens.
/// </summary>
public interface IJwtTokenService
{
	/// <summary>
	/// Generates an access token for the user.
	/// </summary>
	/// <typeparam name="TUser">The type of user (AdminUser or User)</typeparam>
	string GenerateAccessToken<TUser>(TUser user, IList<string> roles)
		where TUser : IdentityUser<Guid>;

	/// <summary>
	/// Generates a refresh token.
	/// </summary>
	string GenerateRefreshToken();

	/// <summary>
	/// Validates and extracts the user ID from an access token.
	/// </summary>
	Guid? ValidateAccessToken(string token);
}
