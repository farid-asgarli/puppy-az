namespace PetWebsite.Infrastructure.Configuration;

/// <summary>
/// Configuration options for SMS service (ATL InfoTech / atlsms.az provider).
/// </summary>
public class SmsSettings
{
	public const string SectionName = "SmsSettings";

	/// <summary>
	/// Login username for SMS provider.
	/// </summary>
	public string Login { get; set; } = string.Empty;

	/// <summary>
	/// Sender name that appears in SMS messages.
	/// </summary>
	public string Sender { get; set; } = string.Empty;

	/// <summary>
	/// Password for SMS provider authentication. MD5 hash of this is used as the key.
	/// </summary>
	public string Password { get; set; } = string.Empty;

	/// <summary>
	/// API endpoint for sending SMS messages (JSON API).
	/// </summary>
	public string SendMessageUrl { get; set; } = "https://click.atlsms.az/index.php?app=json_api_send";

	/// <summary>
	/// API endpoint for the XML Bulk API (used for balance checks).
	/// </summary>
	public string BulkApiUrl { get; set; } = "https://click.atlsms.az/bulksms/api";
}
