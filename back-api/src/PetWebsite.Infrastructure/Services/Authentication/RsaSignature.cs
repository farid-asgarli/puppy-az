using System.Security.Cryptography;
using Microsoft.IdentityModel.Tokens;
using PetWebsite.Application.Common.Configuration;

namespace PetWebsite.Infrastructure.Services.Authentication;

/// <summary>
/// Utility class for creating RSA security keys from various formats.
/// </summary>
public static class RsaSignature
{
	/// <summary>
	/// Creates an RSA security key from XML format.
	/// </summary>
	/// <param name="xmlKey">RSA key in XML format</param>
	/// <returns>RSA security key</returns>
	public static RsaSecurityKey GetKeyFromXml(string xmlKey)
	{
		using var rsa = RSA.Create();
		rsa.FromXmlString(xmlKey);
		return new RsaSecurityKey(rsa.ExportParameters(true));
	}

	/// <summary>
	/// Creates an RSA security key from JSON-compatible Base64-encoded parameters.
	/// </summary>
	/// <param name="parameters">RSA parameters with Base64-encoded strings</param>
	/// <returns>RSA security key</returns>
	public static RsaSecurityKey GetKeyFromJson(RsaStringParameters parameters)
	{
		using var rsa = RSA.Create();
		var rsaParams = new RSAParameters
		{
			Modulus = Convert.FromBase64String(parameters.Modulus),
			Exponent = Convert.FromBase64String(parameters.Exponent),
		};

		// Only load private key components if present (for signing operations)
		if (parameters.P is not null)
		{
			rsaParams.P = Convert.FromBase64String(parameters.P);
			rsaParams.Q = Convert.FromBase64String(parameters.Q!);
			rsaParams.DP = Convert.FromBase64String(parameters.DP!);
			rsaParams.DQ = Convert.FromBase64String(parameters.DQ!);
			rsaParams.InverseQ = Convert.FromBase64String(parameters.InverseQ!);
			rsaParams.D = Convert.FromBase64String(parameters.D!);
		}

		rsa.ImportParameters(rsaParams);
		return new RsaSecurityKey(rsa.ExportParameters(parameters.P is not null));
	}
}
