namespace PetWebsite.Application.Common.Models;

/// <summary>
/// Authentication response with tokens.
/// </summary>
public class AuthenticationResponse
{
	public Guid UserId { get; set; }
	public string Email { get; set; } = string.Empty;
	public string FirstName { get; set; } = string.Empty;
	public string LastName { get; set; } = string.Empty;
	public string[] Roles { get; set; } = [];
	public string AccessToken { get; set; } = string.Empty;
	public string RefreshToken { get; set; } = string.Empty;
	public DateTime ExpiresAt { get; set; }
}
