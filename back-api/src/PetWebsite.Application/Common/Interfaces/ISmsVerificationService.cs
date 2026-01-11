using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Common.Interfaces;

/// <summary>
/// Service for managing SMS verification codes (sending, verifying, cleanup).
/// </summary>
public interface ISmsVerificationService
{
	/// <summary>
	/// Sends a verification code to the specified phone number.
	/// </summary>
	/// <param name="phoneNumber">The phone number to send the code to.</param>
	/// <param name="purpose">Purpose of the verification (e.g., "Registration", "Login").</param>
	/// <param name="cancellationToken">Cancellation token.</param>
	/// <returns>Result indicating success or failure.</returns>
	Task<Result> SendVerificationCodeAsync(string phoneNumber, string purpose, CancellationToken cancellationToken = default);

	/// <summary>
	/// Verifies a code for the specified phone number and purpose.
	/// </summary>
	/// <param name="phoneNumber">The phone number to verify.</param>
	/// <param name="code">The verification code to check.</param>
	/// <param name="purpose">Purpose of the verification (e.g., "Registration", "Login").</param>
	/// <param name="markAsUsed">Whether to mark the code as used after successful verification.</param>
	/// <param name="cancellationToken">Cancellation token.</param>
	/// <returns>Result indicating success or failure with appropriate error messages.</returns>
	Task<Result> VerifyCodeAsync(
		string phoneNumber,
		string code,
		string purpose,
		bool markAsUsed = true,
		CancellationToken cancellationToken = default
	);

	/// <summary>
	/// Cleans up old expired or verified codes for a phone number.
	/// </summary>
	/// <param name="phoneNumber">The phone number to cleanup codes for.</param>
	/// <param name="excludeId">Optional ID to exclude from cleanup.</param>
	/// <param name="cancellationToken">Cancellation token.</param>
	Task CleanupOldCodesAsync(string phoneNumber, int? excludeId = null, CancellationToken cancellationToken = default);
}
