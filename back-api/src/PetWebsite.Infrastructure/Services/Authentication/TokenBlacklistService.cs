using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Infrastructure.Services.Authentication;

/// <summary>
/// Service for managing blacklisted JWT tokens.
/// </summary>
public class TokenBlacklistService(IApplicationDbContext dbContext, ILogger<TokenBlacklistService> logger) : ITokenBlacklistService
{
	public async Task BlacklistTokenAsync(
		string tokenId,
		Guid userId,
		string userType,
		DateTime expiresAt,
		string reason,
		CancellationToken cancellationToken = default
	)
	{
		try
		{
			// Check if already blacklisted
			var exists = await dbContext.BlacklistedTokens.AnyAsync(t => t.TokenId == tokenId, cancellationToken);

			if (exists)
			{
				logger.LogWarning("Token {TokenId} is already blacklisted", tokenId);
				return;
			}

			var blacklistedToken = new BlacklistedToken
			{
				TokenId = tokenId,
				UserId = userId,
				UserType = userType,
				BlacklistedAt = DateTime.UtcNow,
				ExpiresAt = expiresAt,
				Reason = reason,
			};

			dbContext.BlacklistedTokens.Add(blacklistedToken);
			await dbContext.SaveChangesAsync(cancellationToken);

			logger.LogInformation(
				"Token {TokenId} blacklisted for user {UserId} ({UserType}). Reason: {Reason}",
				tokenId,
				userId,
				userType,
				reason
			);
		}
		catch (Exception ex)
		{
			logger.LogError(ex, "Failed to blacklist token {TokenId}", tokenId);
			throw;
		}
	}

	public async Task<bool> IsTokenBlacklistedAsync(string tokenId, CancellationToken cancellationToken = default)
	{
		try
		{
			return await dbContext.BlacklistedTokens.AnyAsync(t => t.TokenId == tokenId, cancellationToken);
		}
		catch (Exception ex)
		{
			logger.LogError(ex, "Failed to check if token {TokenId} is blacklisted", tokenId);
			// In case of error, treat as not blacklisted to avoid blocking legitimate users
			return false;
		}
	}

	public async Task<int> CleanupExpiredTokensAsync(CancellationToken cancellationToken = default)
	{
		try
		{
			var expiredTokens = await dbContext.BlacklistedTokens.Where(t => t.ExpiresAt < DateTime.UtcNow).ToListAsync(cancellationToken);

			if (expiredTokens.Count == 0)
			{
				logger.LogInformation("No expired tokens to clean up");
				return 0;
			}

			dbContext.BlacklistedTokens.RemoveRange(expiredTokens);
			await dbContext.SaveChangesAsync(cancellationToken);

			logger.LogInformation("Cleaned up {Count} expired blacklisted tokens", expiredTokens.Count);
			return expiredTokens.Count;
		}
		catch (Exception ex)
		{
			logger.LogError(ex, "Failed to cleanup expired tokens");
			throw;
		}
	}
}
