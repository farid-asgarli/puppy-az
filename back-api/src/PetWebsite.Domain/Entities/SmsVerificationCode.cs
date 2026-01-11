namespace PetWebsite.Domain.Entities;

/// <summary>
/// Represents an SMS verification code sent to a phone number.
/// Used for phone number verification during registration or other operations.
/// </summary>
public class SmsVerificationCode
{
	public int Id { get; set; }

	/// <summary>
	/// The phone number to which the verification code was sent.
	/// </summary>
	public string PhoneNumber { get; set; } = string.Empty;

	/// <summary>
	/// The verification code sent to the user.
	/// </summary>
	public string Code { get; set; } = string.Empty;

	/// <summary>
	/// When the verification code was created.
	/// </summary>
	public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

	/// <summary>
	/// When the verification code expires.
	/// </summary>
	public DateTime ExpiresAt { get; set; }

	/// <summary>
	/// Whether the code has been used/verified.
	/// </summary>
	public bool IsVerified { get; set; } = false;

	/// <summary>
	/// When the code was verified (if applicable).
	/// </summary>
	public DateTime? VerifiedAt { get; set; }

	/// <summary>
	/// Purpose of the verification code (e.g., "Registration", "PasswordReset").
	/// </summary>
	public string Purpose { get; set; } = "Registration";
}
