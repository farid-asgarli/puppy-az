namespace PetWebsite.Domain.Constants;

/// <summary>
/// Defines admin user roles in the system.
/// </summary>
public static class AdminRoles
{
	public const string SuperAdmin = "SuperAdmin";
	public const string Admin = "Admin";
	public const string Moderator = "Moderator";

	public static readonly string[] AllRoles = [SuperAdmin, Admin, Moderator];
}
