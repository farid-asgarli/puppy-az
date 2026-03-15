using System.Text;
using System.Text.Encodings.Web;
using System.Text.Json.Serialization;
using System.Text.Unicode;
using PetWebsite.API.Conventions;
using PetWebsite.API.Extensions;
using PetWebsite.API.Hubs;
using PetWebsite.API.Services;
using PetWebsite.Application;
using PetWebsite.Infrastructure;

// Ensure UTF-8 encoding for console and HTTP responses
Console.OutputEncoding = Encoding.UTF8;
Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);

// Global exception handler for debugging
AppDomain.CurrentDomain.UnhandledException += (sender, args) =>
{
	var ex = args.ExceptionObject as Exception;
	Console.WriteLine($"[FATAL] Unhandled exception: {ex?.Message}");
	Console.WriteLine($"[FATAL] Stack trace: {ex?.StackTrace}");
};

AppDomain.CurrentDomain.ProcessExit += (sender, args) =>
{
	Console.WriteLine($"[DEBUG] ProcessExit event triggered at {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss} UTC");
};

Console.CancelKeyPress += (sender, args) =>
{
	Console.WriteLine($"[DEBUG] CancelKeyPress (Ctrl+C) received at {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss} UTC");
};

// Debug logging for startup
Console.WriteLine($"[DEBUG] Application starting at {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss} UTC");
Console.WriteLine($"[DEBUG] Current directory: {Directory.GetCurrentDirectory()}");
Console.WriteLine($"[DEBUG] Environment: {Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production"}");
Console.WriteLine($"[DEBUG] Process ID: {Environment.ProcessId}");

var builder = WebApplication.CreateBuilder(args);

// Configure structured logging (Serilog) - commented out, requires package
// builder.Host.AddSerilogConfiguration();

// Configure services
builder.Services.AddControllers(options =>
{
	options.Conventions.Add(new KebabCaseRouteConvention());
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddHttpContextAccessor();

// Log key configuration at startup so it appears in journalctl
var apiUrl = builder.Configuration["App:BaseUrl"] ?? "(not set)";
var dbConn = builder.Configuration.GetConnectionString("DefaultConnection") ?? "(not set)";
var env = builder.Environment.EnvironmentName;
Console.WriteLine($"[STARTUP] Environment    : {env}");
Console.WriteLine($"[STARTUP] App:BaseUrl    : {apiUrl}");
Console.WriteLine($"[STARTUP] DB connection  : {dbConn}");

// Configure custom services
builder.Services.AddSingleton(TimeProvider.System);

builder.Services.AddProblemDetailsConfiguration();
builder.Services.AddCorsConfiguration(builder.Configuration, builder.Environment);
builder.Services.AddLocalizationConfiguration(builder.Environment);
builder.Services.AddSwaggerConfiguration();
builder.Services.AddJwtAuthentication(builder.Configuration, builder.Environment);

// Performance & Security
builder.Services.AddHealthChecksConfiguration(builder.Configuration);
builder.Services.AddRateLimitingConfiguration();
builder.Services.AddCompressionConfiguration();
builder.Services.AddCachingConfiguration();

// API Versioning - commented out, requires package: Asp.Versioning.Mvc
// builder.Services.AddApiVersioningConfiguration();

// Add Application and Infrastructure layers
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

// Add SignalR
builder.Services.AddSignalR(options =>
{
	options.EnableDetailedErrors = builder.Environment.IsDevelopment();
	options.KeepAliveInterval = TimeSpan.FromSeconds(15);
	options.ClientTimeoutInterval = TimeSpan.FromSeconds(30);
});
builder.Services.AddScoped<INotificationService, NotificationService>();
Console.WriteLine("[DEBUG] SignalR configured");

var app = builder.Build();

// Seed database - DISABLED FOR NOW
try
{
	await app.SeedDatabaseAsync();
}
catch (Exception ex)
{
	Console.WriteLine($"Error seeding database: {ex.Message}");
}

// Configure middleware pipeline (order matters!)
app.UseResponseCompression();
app.UseResponseCaching();
app.UseRateLimiter();

app.ConfigureMiddleware();
app.ConfigureSwagger();

// app.UseHttpsRedirection();

// Serve admin panel SPA — middleware fallback for client-side routing
app.Use(
	async (context, next) =>
	{
		await next();

		// If the response is 404 and the request is for an admin panel route (not a file),
		// serve the admin SPA index.html so React Router can handle it
		if (
			context.Response.StatusCode == 404
			&& !context.Response.HasStarted
			&& context.Request.Path.StartsWithSegments("/admin")
			&& !Path.HasExtension(context.Request.Path.Value)
		)
		{
			context.Response.StatusCode = 200;
			context.Response.ContentType = "text/html";
			var indexPath = Path.Combine(app.Environment.WebRootPath, "admin", "index.html");
			await context.Response.SendFileAsync(indexPath);
		}
	}
);
Console.WriteLine("[DEBUG] Admin panel SPA fallback configured");

app.MapControllers();
Console.WriteLine("[DEBUG] Controllers mapped");

// Map SignalR hub
app.MapHub<NotificationHub>("/hubs/notifications");
Console.WriteLine("[DEBUG] SignalR NotificationHub mapped to /hubs/notifications");

// Map health check endpoints
app.MapHealthCheckEndpoints();
Console.WriteLine("[DEBUG] Health check endpoints mapped");

// Log application lifetime events
var lifetime = app.Services.GetRequiredService<IHostApplicationLifetime>();
lifetime.ApplicationStarted.Register(() => Console.WriteLine($"[DEBUG] Application STARTED at {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss} UTC"));
lifetime.ApplicationStopping.Register(() =>
	Console.WriteLine($"[DEBUG] Application STOPPING at {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss} UTC")
);
lifetime.ApplicationStopped.Register(() => Console.WriteLine($"[DEBUG] Application STOPPED at {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss} UTC"));

Console.WriteLine("[DEBUG] Starting application run loop...");
app.Run();
