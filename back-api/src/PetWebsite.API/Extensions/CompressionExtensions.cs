using System.IO.Compression;
using Microsoft.AspNetCore.ResponseCompression;

namespace PetWebsite.API.Extensions;

public static class CompressionExtensions
{
	public static IServiceCollection AddCompressionConfiguration(this IServiceCollection services)
	{
		services.AddResponseCompression(options =>
		{
			options.EnableForHttps = true;
			options.Providers.Add<BrotliCompressionProvider>();
			options.Providers.Add<GzipCompressionProvider>();
			options.MimeTypes = ResponseCompressionDefaults.MimeTypes.Concat(
				["application/json", "application/problem+json", "image/svg+xml"]
			);
		});

		services.Configure<BrotliCompressionProviderOptions>(options =>
		{
			options.Level = CompressionLevel.Fastest;
		});

		services.Configure<GzipCompressionProviderOptions>(options =>
		{
			options.Level = CompressionLevel.Fastest;
		});

		return services;
	}
}
