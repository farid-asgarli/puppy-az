namespace PetWebsite.API.Models.Requests.Admin;

/// <summary>
/// Request model for updating a user.
/// </summary>
public record UpdateUserRequest(string FirstName, string LastName, bool IsActive);

/// <summary>
/// Request model for updating a role.
/// </summary>
public record UpdateRoleRequest(string NewRoleName);

/// <summary>
/// Request model for assigning a role to a user.
/// </summary>
public record AssignRoleRequest(string RoleName);

/// <summary>
/// Request model for removing a role from a user.
/// </summary>
public record RemoveRoleRequest(string RoleName);
