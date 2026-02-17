using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Domain.Enums;

namespace PetWebsite.Infrastructure.Services;

/// <summary>
/// Background service that automatically expires pet ads after 30 days of being published.
/// Runs every hour to check for expired ads.
/// </summary>
public class AdExpirationService : BackgroundService
{
	private readonly IServiceScopeFactory _scopeFactory;
	private readonly ILogger<AdExpirationService> _logger;
	private readonly TimeSpan _checkInterval = TimeSpan.FromHours(1);

	public AdExpirationService(
		IServiceScopeFactory scopeFactory,
		ILogger<AdExpirationService> logger)
	{
		_scopeFactory = scopeFactory;
		_logger = logger;
	}

	protected override async Task ExecuteAsync(CancellationToken stoppingToken)
	{
		_logger.LogInformation("Ad Expiration Service started.");

		while (!stoppingToken.IsCancellationRequested)
		{
			try
			{
				await ExpireOldAdsAsync(stoppingToken);
				await ExpirePremiumAndVipStatusAsync(stoppingToken);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error occurred while expiring ads.");
			}

			await Task.Delay(_checkInterval, stoppingToken);
		}

		_logger.LogInformation("Ad Expiration Service stopped.");
	}

	private async Task ExpireOldAdsAsync(CancellationToken cancellationToken)
	{
		using var scope = _scopeFactory.CreateScope();
		var dbContext = scope.ServiceProvider.GetRequiredService<IApplicationDbContext>();

		var now = DateTime.UtcNow;
		var expirationThreshold = now.AddDays(-30);

		// Find all published ads that were published more than 30 days ago
		// OR ads where ExpiresAt has passed
		var expiredAds = await dbContext.PetAds
			.Where(ad => 
				ad.Status == PetAdStatus.Published && 
				!ad.IsDeleted &&
				(
					(ad.ExpiresAt.HasValue && ad.ExpiresAt <= now) ||
					(!ad.ExpiresAt.HasValue && ad.PublishedAt.HasValue && ad.PublishedAt <= expirationThreshold)
				))
			.ToListAsync(cancellationToken);

		if (expiredAds.Count > 0)
		{
			_logger.LogInformation("Found {Count} ads to expire.", expiredAds.Count);

			foreach (var ad in expiredAds)
			{
				ad.Status = PetAdStatus.Expired;
				ad.IsAvailable = false;
				_logger.LogDebug("Expired ad ID: {AdId}, Published: {PublishedAt}", ad.Id, ad.PublishedAt);
			}

			await dbContext.SaveChangesAsync(cancellationToken);
			_logger.LogInformation("Successfully expired {Count} ads.", expiredAds.Count);
		}
		else
		{
			_logger.LogDebug("No ads to expire at this time.");
		}
	}

	/// <summary>
	/// Removes expired Premium and VIP statuses from ads.
	/// </summary>
	private async Task ExpirePremiumAndVipStatusAsync(CancellationToken cancellationToken)
	{
		using var scope = _scopeFactory.CreateScope();
		var dbContext = scope.ServiceProvider.GetRequiredService<IApplicationDbContext>();

		var now = DateTime.UtcNow;

		// Find ads with expired Premium status
		var expiredPremiumAds = await dbContext.PetAds
			.Where(ad => 
				ad.IsPremium && 
				ad.PremiumExpiresAt.HasValue && 
				ad.PremiumExpiresAt <= now &&
				!ad.IsDeleted)
			.ToListAsync(cancellationToken);

		if (expiredPremiumAds.Count > 0)
		{
			_logger.LogInformation("Found {Count} ads with expired Premium status.", expiredPremiumAds.Count);

			foreach (var ad in expiredPremiumAds)
			{
				ad.IsPremium = false;
				ad.PremiumActivatedAt = null;
				ad.PremiumExpiresAt = null;
				_logger.LogDebug("Removed Premium from ad ID: {AdId}", ad.Id);
			}

			await dbContext.SaveChangesAsync(cancellationToken);
			_logger.LogInformation("Successfully removed Premium status from {Count} ads.", expiredPremiumAds.Count);
		}

		// Find ads with expired VIP status
		var expiredVipAds = await dbContext.PetAds
			.Where(ad => 
				ad.IsVip && 
				ad.VipExpiresAt.HasValue && 
				ad.VipExpiresAt <= now &&
				!ad.IsDeleted)
			.ToListAsync(cancellationToken);

		if (expiredVipAds.Count > 0)
		{
			_logger.LogInformation("Found {Count} ads with expired VIP status.", expiredVipAds.Count);

			foreach (var ad in expiredVipAds)
			{
				ad.IsVip = false;
				ad.VipActivatedAt = null;
				ad.VipExpiresAt = null;
				_logger.LogDebug("Removed VIP from ad ID: {AdId}", ad.Id);
			}

			await dbContext.SaveChangesAsync(cancellationToken);
			_logger.LogInformation("Successfully removed VIP status from {Count} ads.", expiredVipAds.Count);
		}
	}
}
