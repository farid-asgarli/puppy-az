using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using PetWebsite.Application.Common.Configuration;
using PetWebsite.Application.Common.Interfaces;

namespace PetWebsite.Infrastructure.Services.Authentication;

/// <summary>
/// Service for generating and validating JWT tokens using RSA-256 (asymmetric encryption).
/// Provides enhanced security over HMAC-based symmetric algorithms.
/// </summary>
public class JwtTokenService(IOptions<JwtSettings> jwtSettings) : IJwtTokenService
{
	private readonly JwtSettings _jwtSettings = jwtSettings.Value;

	public string GenerateAccessToken<TUser>(TUser user, IList<string> roles)
		where TUser : IdentityUser<Guid>
	{
		var claims = new List<Claim>
		{
			new(ClaimTypes.NameIdentifier, user.Id.ToString()),
			new(ClaimTypes.Email, user.Email!),
			new(ClaimTypes.Name, user.UserName!),
			new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
		};

		// Add user type claim to distinguish between admin and regular users
		var userType = user.GetType().Name; // "AdminUser" or "User"
		claims.Add(new Claim("user_type", userType));

		// Add roles as claims
		claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

		var credentials = GetSigningCredentials();

		var token = new JwtSecurityToken(
			issuer: _jwtSettings.Issuer,
			audience: _jwtSettings.Audience,
			claims: claims,
			expires: DateTime.UtcNow.AddMinutes(_jwtSettings.AccessTokenExpirationMinutes),
			signingCredentials: credentials
		);

		return new JwtSecurityTokenHandler().WriteToken(token);
	}

	public string GenerateRefreshToken()
	{
		var randomNumber = new byte[64];
		using var rng = RandomNumberGenerator.Create();
		rng.GetBytes(randomNumber);
		return Convert.ToBase64String(randomNumber);
	}

	public Guid? ValidateAccessToken(string token)
	{
		try
		{
			var tokenHandler = new JwtSecurityTokenHandler();
			var validationParameters = GetValidationParameters();

			tokenHandler.ValidateToken(token, validationParameters, out SecurityToken validatedToken);

			var jwtToken = (JwtSecurityToken)validatedToken;
			var userIdClaim = jwtToken.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value;

			return Guid.Parse(userIdClaim);
		}
		catch
		{
			return null;
		}
	}

	/// <summary>
	/// Gets signing credentials using RSA-256 private key.
	/// </summary>
	private SigningCredentials GetSigningCredentials()
	{
		if (_jwtSettings.PrivateSecurityKey is null)
		{
			throw new InvalidOperationException(
				"JWT configuration error: PrivateSecurityKey (RSA private key) must be configured for token signing."
			);
		}

		var rsaKey = RsaSignature.GetKeyFromJson(_jwtSettings.PrivateSecurityKey);
		return new SigningCredentials(rsaKey, SecurityAlgorithms.RsaSha256);
	}

	/// <summary>
	/// Gets token validation parameters using RSA-256 public key.
	/// </summary>
	private TokenValidationParameters GetValidationParameters()
	{
		if (_jwtSettings.PublicSecurityKey is null)
		{
			throw new InvalidOperationException(
				"JWT configuration error: PublicSecurityKey (RSA public key) must be configured for token validation."
			);
		}

		var rsaKey = RsaSignature.GetKeyFromJson(_jwtSettings.PublicSecurityKey);

		return new TokenValidationParameters
		{
			ValidateIssuerSigningKey = true,
			IssuerSigningKey = rsaKey,
			ValidateIssuer = true,
			ValidIssuer = _jwtSettings.Issuer,
			ValidateAudience = true,
			ValidAudience = _jwtSettings.Audience,
			ValidateLifetime = true,
			ClockSkew = TimeSpan.Zero,
		};
	}
}
