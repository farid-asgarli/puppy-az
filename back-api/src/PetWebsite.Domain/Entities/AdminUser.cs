using Microsoft.AspNetCore.Identity;

namespace PetWebsite.Domain.Entities;

/// <summary>
/// Represents an admin user with enhanced Identity features.
/// </summary>
public class AdminUser : IdentityUser<Guid>
{
	public string FirstName { get; set; } = string.Empty;
	public string LastName { get; set; } = string.Empty;
	public string? RefreshToken { get; set; }
	public DateTime? RefreshTokenExpiryTime { get; set; }
	public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
	public DateTime? LastLoginAt { get; set; }
	public bool IsActive { get; set; } = true;
}
