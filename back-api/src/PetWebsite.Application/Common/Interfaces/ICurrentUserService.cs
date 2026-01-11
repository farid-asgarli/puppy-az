namespace PetWebsite.Application.Common.Interfaces;

/// <summary>
/// Service for accessing current user context information.
/// Abstracts HttpContext access away from handlers to improve testability and clean architecture adherence.
/// </summary>
public interface ICurrentUserService
{
	/// <summary>
	/// Gets the current authenticated user's ID.
	/// </summary>
	Guid? UserId { get; }

	/// <summary>
	/// Gets the current user's email.
	/// </summary>
	string? UserEmail { get; }

	/// <summary>
	/// Gets the current user's roles.
	/// </summary>
	IEnumerable<string> Roles { get; }

	/// <summary>
	/// Gets the current culture code from Accept-Language header or defaults to 'en'.
	/// </summary>
	string CurrentCulture { get; }

	/// <summary>
	/// Checks if the current user is authenticated.
	/// </summary>
	bool IsAuthenticated { get; }

	/// <summary>
	/// Checks if the current user has the specified role.
	/// </summary>
	bool IsInRole(string role);

	/// <summary>
	/// Checks if the current user has any of the specified roles.
	/// </summary>
	bool IsInAnyRole(params string[] roles);

	/// <summary>
	/// Checks if the current user has all of the specified roles.
	/// </summary>
	bool IsInAllRoles(params string[] roles);

	/// <summary>
	/// Gets the JWT token ID (jti claim) from the current request.
	/// </summary>
	string? GetTokenId();

	/// <summary>
	/// Gets the JWT token expiration timestamp (exp claim) from the current request.
	/// </summary>
	DateTime? GetTokenExpiration();
}
