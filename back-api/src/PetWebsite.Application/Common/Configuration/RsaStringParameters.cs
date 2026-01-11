namespace PetWebsite.Application.Common.Configuration;

/// <summary>
/// RSA key parameters in Base64-encoded string format for JSON configuration.
/// </summary>
public class RsaStringParameters
{
	/// <summary>
	/// Private exponent (D) - Required for signing (private key operations).
	/// </summary>
	public string? D { get; init; }

	/// <summary>
	/// D mod (P-1) - Required for signing (private key operations).
	/// </summary>
	public string? DP { get; init; }

	/// <summary>
	/// D mod (Q-1) - Required for signing (private key operations).
	/// </summary>
	public string? DQ { get; init; }

	/// <summary>
	/// Public exponent (E) - Required for both public and private keys.
	/// </summary>
	public required string Exponent { get; init; }

	/// <summary>
	/// Inverse of Q mod P - Required for signing (private key operations).
	/// </summary>
	public string? InverseQ { get; init; }

	/// <summary>
	/// Modulus (N) - Required for both public and private keys.
	/// </summary>
	public required string Modulus { get; init; }

	/// <summary>
	/// First prime factor - Required for signing (private key operations).
	/// </summary>
	public string? P { get; init; }

	/// <summary>
	/// Second prime factor - Required for signing (private key operations).
	/// </summary>
	public string? Q { get; init; }
}
