using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Common.Interfaces;

/// <summary>
/// Service for sending SMS messages via LSIM provider.
/// </summary>
public interface ISmsService
{
	/// <summary>
	/// Sends an SMS message to the specified phone number.
	/// </summary>
	/// <param name="options">Options containing message body and recipient number.</param>
	/// <param name="cancellationToken">Cancellation token.</param>
	/// <exception cref="Domain.Exceptions.SmsException">Thrown when SMS operation fails.</exception>
	Task SendSmsAsync(SendSmsOptions options, CancellationToken cancellationToken = default);

	/// <summary>
	/// Checks the SMS balance from the provider.
	/// </summary>
	/// <param name="cancellationToken">Cancellation token.</param>
	/// <returns>The balance amount.</returns>
	/// <exception cref="Domain.Exceptions.SmsException">Thrown when balance check fails.</exception>
	Task<decimal> CheckSmsBalanceAsync(CancellationToken cancellationToken = default);
}
