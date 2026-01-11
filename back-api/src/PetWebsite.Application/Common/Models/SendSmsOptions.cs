namespace PetWebsite.Application.Common.Models;

/// <summary>
/// Options for sending an SMS message.
/// </summary>
public class SendSmsOptions
{
	/// <summary>
	/// The message body/text content.
	/// </summary>
	public string Body { get; set; } = string.Empty;

	/// <summary>
	/// The recipient phone number (MSISDN format).
	/// </summary>
	public string Msisdn { get; set; } = string.Empty;
}
