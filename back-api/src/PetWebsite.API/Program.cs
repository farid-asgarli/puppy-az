using PetWebsite.API.Conventions;
using PetWebsite.API.Extensions;
using PetWebsite.Application;
using PetWebsite.Infrastructure;
using System.Text;
using System.Text.Encodings.Web;
using System.Text.Json.Serialization;
using System.Text.Unicode;

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
Console.WriteLine("[DEBUG] Adding Application layer...");
builder.Services.AddApplication();
Console.WriteLine("[DEBUG] Adding Infrastructure layer...");
try
{
	builder.Services.AddInfrastructure(builder.Configuration);
	Console.WriteLine("[DEBUG] Infrastructure layer added successfully");
}
catch (Exception ex)
{
	Console.WriteLine($"[ERROR] Failed to add Infrastructure: {ex.Message}");
	Console.WriteLine($"[ERROR] Stack trace: {ex.StackTrace}");
	throw;
}

Console.WriteLine("[DEBUG] Building application...");
var app = builder.Build();
Console.WriteLine("[DEBUG] Application built successfully");

// Seed database - DISABLED FOR NOW
//try
//{
//	await app.SeedDatabaseAsync();
//}
//catch (Exception ex)
//{
//	Console.WriteLine($"Error seeding database: {ex.Message}");
//}

// Configure middleware pipeline (order matters!)
app.UseResponseCompression();
app.UseResponseCaching();
app.UseRateLimiter();

app.ConfigureMiddleware();
app.ConfigureSwagger();

// app.UseHttpsRedirection();

app.MapControllers();
Console.WriteLine("[DEBUG] Controllers mapped");

// Map health check endpoints
app.MapHealthCheckEndpoints();
Console.WriteLine("[DEBUG] Health check endpoints mapped");

// Log application lifetime events
var lifetime = app.Services.GetRequiredService<IHostApplicationLifetime>();
lifetime.ApplicationStarted.Register(() => Console.WriteLine($"[DEBUG] Application STARTED at {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss} UTC"));
lifetime.ApplicationStopping.Register(() => Console.WriteLine($"[DEBUG] Application STOPPING at {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss} UTC"));
lifetime.ApplicationStopped.Register(() => Console.WriteLine($"[DEBUG] Application STOPPED at {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss} UTC"));

Console.WriteLine("[DEBUG] Starting application run loop...");
app.Run();
