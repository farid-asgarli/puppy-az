namespace PetWebsite.Infrastructure.Configuration;

/// <summary>
/// Configuration options for SMS service (LSIM/Falkon.az provider).
/// </summary>
public class SmsSettings
{
	public const string SectionName = "SmsSettings";

	/// <summary>
	/// Secret key for SMS service.
	/// </summary>
	public string Secret { get; set; } = string.Empty;

	/// <summary>
	/// Login username for SMS provider.
	/// </summary>
	public string Login { get; set; } = string.Empty;

	/// <summary>
	/// Sender name that appears in SMS messages.
	/// </summary>
	public string Sender { get; set; } = string.Empty;

	/// <summary>
	/// Password for SMS provider authentication.
	/// </summary>
	public string Password { get; set; } = string.Empty;

	/// <summary>
	/// API endpoint for sending SMS messages.
	/// </summary>
	public string SendMessageUrl { get; set; } = "http://apps.lsim.az/quicksms/v1/send?";

	/// <summary>
	/// API endpoint for checking SMS balance.
	/// </summary>
	public string CheckBalanceUrl { get; set; } = "http://apps.lsim.az/quicksms/v1/balance?";

	/// <summary>
	/// Login URL for the SMS provider portal.
	/// </summary>
	public string LoginUrl { get; set; } = "https://ci.falkon.az/login";
}
