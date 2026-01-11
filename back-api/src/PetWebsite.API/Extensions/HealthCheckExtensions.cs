using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace PetWebsite.API.Extensions;

public static class HealthCheckExtensions
{
	public static IServiceCollection AddHealthChecksConfiguration(this IServiceCollection services, IConfiguration configuration)
	{
		services
			.AddHealthChecks()
			// Requires NuGet package: AspNetCore.HealthChecks.Npgsql
			// Uncomment after: dotnet add package AspNetCore.HealthChecks.Npgsql
			// .AddNpgSql(
			// 	configuration.GetConnectionString("DefaultConnection")!,
			// 	name: "database",
			// 	failureStatus: HealthStatus.Unhealthy,
			// 	tags: new[] { "db", "postgres" }
			// )
			.AddCheck("self", () => HealthCheckResult.Healthy(), tags: ["api"]);

		return services;
	}

	public static WebApplication MapHealthCheckEndpoints(this WebApplication app)
	{
		app.MapHealthChecks(
			"/health",
			new Microsoft.AspNetCore.Diagnostics.HealthChecks.HealthCheckOptions
			{
				Predicate = _ => true,
				ResponseWriter = async (context, report) =>
				{
					context.Response.ContentType = "application/json";
					var response = new
					{
						status = report.Status.ToString(),
						totalDuration = report.TotalDuration.TotalMilliseconds,
						checks = report.Entries.Select(e => new
						{
							name = e.Key,
							status = e.Value.Status.ToString(),
							duration = e.Value.Duration.TotalMilliseconds,
							description = e.Value.Description,
							exception = e.Value.Exception?.Message,
							data = e.Value.Data,
						}),
					};

					await context.Response.WriteAsJsonAsync(response);
				},
			}
		);

		// Lightweight endpoint for load balancers
		app.MapHealthChecks(
			"/health/ready",
			new Microsoft.AspNetCore.Diagnostics.HealthChecks.HealthCheckOptions { Predicate = check => check.Tags.Contains("db") }
		);

		app.MapHealthChecks(
			"/health/live",
			new Microsoft.AspNetCore.Diagnostics.HealthChecks.HealthCheckOptions { Predicate = check => check.Tags.Contains("api") }
		);

		return app;
	}
}
