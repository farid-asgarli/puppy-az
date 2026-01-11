namespace PetWebsite.API.Extensions;

public static class CachingExtensions
{
	public static IServiceCollection AddCachingConfiguration(this IServiceCollection services)
	{
		// Add response caching
		services.AddResponseCaching(options =>
		{
			options.MaximumBodySize = 1024 * 1024 * 10; // 10 MB
			options.UseCaseSensitivePaths = false;
		});

		// Add memory cache for in-app caching
		services.AddMemoryCache(options =>
		{
			options.SizeLimit = 1024 * 1024 * 100; // 100 MB limit
			options.CompactionPercentage = 0.25; // Compact 25% when limit reached
		});

		// Add distributed cache (can switch to Redis later)
		services.AddDistributedMemoryCache();

		return services;
	}
}
