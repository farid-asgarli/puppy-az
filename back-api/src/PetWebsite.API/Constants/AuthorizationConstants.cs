namespace PetWebsite.API.Constants;

/// <summary>
/// Constants for authorization roles and policies.
/// Centralizes authorization configuration for maintainability.
/// </summary>
public static class AuthorizationConstants
{
	/// <summary>
	/// Role names used in the application.
	/// </summary>
	public static class Roles
	{
		public const string SuperAdmin = nameof(SuperAdmin);
		public const string Admin = nameof(Admin);
		public const string User = nameof(User);
	}

	/// <summary>
	/// Authorization policies used in the application.
	/// </summary>
	public static class Policies
	{
		public const string RequireSuperAdminRole = nameof(RequireSuperAdminRole);
		public const string RequireAdminRole = nameof(RequireAdminRole);
		public const string RequireAnyAdminRole = nameof(RequireAnyAdminRole);
		public const string RequireUserRole = nameof(RequireUserRole);
	}
}
