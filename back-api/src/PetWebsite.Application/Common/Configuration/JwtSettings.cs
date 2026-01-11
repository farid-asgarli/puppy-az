namespace PetWebsite.Application.Common.Configuration;

/// <summary>
/// JWT authentication settings with RSA-256 support.
/// </summary>
public class JwtSettings
{
	public const string SectionName = nameof(JwtSettings);

	/// <summary>
	/// RSA private key parameters for signing tokens (JSON format with Base64-encoded values).
	/// Required for token generation.
	/// </summary>
	public RsaStringParameters? PrivateSecurityKey { get; set; }

	/// <summary>
	/// RSA public key parameters for validating tokens (JSON format with Base64-encoded values).
	/// Required for token validation.
	/// </summary>
	public RsaStringParameters? PublicSecurityKey { get; set; }

	public string Issuer { get; set; } = string.Empty;
	public string Audience { get; set; } = string.Empty;
	public int AccessTokenExpirationMinutes { get; set; } = 60; // 1 hour
	public int RefreshTokenExpirationDays { get; set; } = 7; // 7 days
}
