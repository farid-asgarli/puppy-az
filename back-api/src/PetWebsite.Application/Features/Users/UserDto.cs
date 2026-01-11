namespace PetWebsite.Application.Features.Users;

/// <summary>
/// DTO representing user profile information.
/// </summary>
public class UserProfileDto
{
	public Guid Id { get; init; }
	public string Email { get; init; } = string.Empty;
	public string FirstName { get; init; } = string.Empty;
	public string LastName { get; init; } = string.Empty;
	public string? PhoneNumber { get; init; }
	public string? ProfilePictureUrl { get; init; }
	public DateTime CreatedAt { get; init; }
	public DateTime? LastLoginAt { get; init; }
}
