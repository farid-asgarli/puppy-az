using Microsoft.AspNetCore.Identity;
using PetWebsite.API.Middleware;
using PetWebsite.Domain.Entities;
using PetWebsite.Infrastructure.Persistence;

namespace PetWebsite.API.Extensions;

public static class WebApplicationExtensions
{
	public static async Task<WebApplication> SeedDatabaseAsync(this WebApplication app)
	{
		using var scope = app.Services.CreateScope();
		var services = scope.ServiceProvider;

		try
		{
			var context = services.GetRequiredService<ApplicationDbContext>();
			var userManager = services.GetRequiredService<UserManager<AdminUser>>();
			var roleManager = services.GetRequiredService<RoleManager<IdentityRole<Guid>>>();

			await context.Database.EnsureCreatedAsync();

			await DatabaseSeeder.SeedAsync(context, userManager, roleManager);
		}
		catch (Exception ex)
		{
			var logger = services.GetRequiredService<ILogger<Program>>();
			logger.LogError(ex, "An error occurred while seeding the database.");
		}

		return app;
	}

	public static WebApplication ConfigureMiddleware(this WebApplication app)
	{
		// Configure static files with caching and CORS headers
		app.UseStaticFiles(
			new StaticFileOptions
			{
				OnPrepareResponse = ctx =>
				{
					// Add CORS headers for static files (images, etc.)
					ctx.Context.Response.Headers.Append("Access-Control-Allow-Origin", "*");
					ctx.Context.Response.Headers.Append("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

					// Cache static files for 1 day (increase for production if needed)
					const int durationInSeconds = 60 * 60 * 24; // 1 day
					ctx.Context.Response.Headers[Microsoft.Net.Http.Headers.HeaderNames.CacheControl] =
						"public,max-age=" + durationInSeconds;
				},
			}
		);

		// Add request/response logging middleware (only in Development)
		if (app.Environment.IsDevelopment())
		{
			app.UseMiddleware<RequestResponseLoggingMiddleware>();
		}

		// Use built-in ProblemDetails middleware for error handling
		app.UseExceptionHandler();
		app.UseStatusCodePages();

		// Custom exception handling middleware (fallback)
		app.UseMiddleware<ExceptionHandlingMiddleware>();

		app.UseRequestLocalization();
		app.UseCors("AllowedOrigins");

		// Add token blacklist middleware after authentication
		app.UseAuthentication();
		app.UseMiddleware<TokenBlacklistMiddleware>();
		app.UseAuthorization();

		return app;
	}

	public static WebApplication ConfigureSwagger(this WebApplication app)
	{
		if (app.Environment.IsDevelopment())
		{
			app.UseSwagger();
			app.UseSwaggerUI(options =>
			{
				// User API
				options.SwaggerEndpoint("/swagger/user/swagger.json", "User API v1");

				// Admin API
				options.SwaggerEndpoint("/swagger/admin/swagger.json", "Admin API v1");

				options.DocumentTitle = "Pet Website API - Interactive Documentation";
				options.RoutePrefix = "swagger";

				options.InjectStylesheet("/swagger-ui.css");
				options.InjectJavascript("/swagger-custom.js");

				options.EnableDeepLinking();
				options.EnableFilter();
				options.EnableValidator();

				options.DisplayRequestDuration();
				options.DocExpansion(Swashbuckle.AspNetCore.SwaggerUI.DocExpansion.None);
				options.DefaultModelsExpandDepth(2);
				options.DefaultModelExpandDepth(2);
			});
		}

		return app;
	}
}
