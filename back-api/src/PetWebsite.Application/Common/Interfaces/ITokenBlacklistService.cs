namespace PetWebsite.Application.Common.Interfaces;

/// <summary>
/// Service for managing blacklisted JWT tokens.
/// </summary>
public interface ITokenBlacklistService
{
	/// <summary>
	/// Adds a token to the blacklist.
	/// </summary>
	/// <param name="tokenId">The JWT token identifier (jti claim)</param>
	/// <param name="userId">The user ID associated with the token</param>
	/// <param name="userType">The type of user (User or AdminUser)</param>
	/// <param name="expiresAt">When the token expires</param>
	/// <param name="reason">The reason for blacklisting</param>
	/// <param name="cancellationToken">Cancellation token</param>
	Task BlacklistTokenAsync(
		string tokenId,
		Guid userId,
		string userType,
		DateTime expiresAt,
		string reason,
		CancellationToken cancellationToken = default
	);

	/// <summary>
	/// Checks if a token is blacklisted.
	/// </summary>
	/// <param name="tokenId">The JWT token identifier (jti claim)</param>
	/// <param name="cancellationToken">Cancellation token</param>
	/// <returns>True if the token is blacklisted, false otherwise</returns>
	Task<bool> IsTokenBlacklistedAsync(string tokenId, CancellationToken cancellationToken = default);

	/// <summary>
	/// Removes all expired tokens from the blacklist.
	/// </summary>
	/// <param name="cancellationToken">Cancellation token</param>
	/// <returns>Number of tokens removed</returns>
	Task<int> CleanupExpiredTokensAsync(CancellationToken cancellationToken = default);
}
