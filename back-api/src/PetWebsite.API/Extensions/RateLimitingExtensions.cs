using System.Threading.RateLimiting;
using Microsoft.AspNetCore.RateLimiting;

namespace PetWebsite.API.Extensions;

public static class RateLimitingExtensions
{
	public static IServiceCollection AddRateLimitingConfiguration(this IServiceCollection services)
	{
		services.AddRateLimiter(options =>
		{
			// Global rate limit: 100 requests per minute per IP
			options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(context =>
				RateLimitPartition.GetFixedWindowLimiter(
					partitionKey: context.Request.Headers.Host.ToString(),
					factory: partition => new FixedWindowRateLimiterOptions
					{
						PermitLimit = 100,
						Window = TimeSpan.FromMinutes(1),
						QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
						QueueLimit = 10,
					}
				)
			);

			// Specific policy for authentication endpoints (stricter)
			options.AddFixedWindowLimiter(
				"auth",
				options =>
				{
					options.PermitLimit = 10;
					options.Window = TimeSpan.FromMinutes(1);
					options.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
					options.QueueLimit = 2;
				}
			);

			// Policy for file uploads (very strict)
			options.AddFixedWindowLimiter(
				"uploads",
				options =>
				{
					options.PermitLimit = 5;
					options.Window = TimeSpan.FromMinutes(1);
					options.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
					options.QueueLimit = 0;
				}
			);

			// Policy for SMS endpoints (expensive operations)
			options.AddFixedWindowLimiter(
				"sms",
				options =>
				{
					options.PermitLimit = 3;
					options.Window = TimeSpan.FromMinutes(5);
					options.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
					options.QueueLimit = 0;
				}
			);

			options.OnRejected = async (context, cancellationToken) =>
			{
				context.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;

				if (context.Lease.TryGetMetadata(MetadataName.RetryAfter, out var retryAfter))
				{
					context.HttpContext.Response.Headers.RetryAfter = retryAfter.TotalSeconds.ToString();
				}

				await context.HttpContext.Response.WriteAsJsonAsync(
					new
					{
						type = "https://tools.ietf.org/html/rfc6585#section-4",
						title = "Too Many Requests",
						status = 429,
						detail = "Rate limit exceeded. Please try again later.",
						retryAfter = retryAfter != TimeSpan.Zero ? (int)retryAfter.TotalSeconds : (int?)null,
					},
					cancellationToken
				);
			};
		});

		return services;
	}
}
