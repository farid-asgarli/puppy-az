namespace PetWebsite.Domain.Entities;

/// <summary>
/// Represents a blacklisted JWT token that has been invalidated (e.g., after logout).
/// Tokens in this table cannot be used for authentication even if they haven't expired yet.
/// </summary>
public class BlacklistedToken
{
	/// <summary>
	/// Gets or sets the unique identifier for the blacklist entry.
	/// </summary>
	public int Id { get; set; }

	/// <summary>
	/// Gets or sets the JWT token identifier (jti claim).
	/// This is the unique identifier embedded in each JWT token.
	/// </summary>
	public string TokenId { get; set; } = string.Empty;

	/// <summary>
	/// Gets or sets the user ID associated with this token.
	/// </summary>
	public Guid UserId { get; set; }

	/// <summary>
	/// Gets or sets the type of user (User or AdminUser).
	/// </summary>
	public string UserType { get; set; } = string.Empty;

	/// <summary>
	/// Gets or sets when the token was blacklisted.
	/// </summary>
	public DateTime BlacklistedAt { get; set; } = DateTime.UtcNow;

	/// <summary>
	/// Gets or sets when the original token expires.
	/// After this time, the entry can be safely removed from the database.
	/// </summary>
	public DateTime ExpiresAt { get; set; }

	/// <summary>
	/// Gets or sets the reason for blacklisting (e.g., "Logout", "Security", "Password Changed").
	/// </summary>
	public string? Reason { get; set; }
}
