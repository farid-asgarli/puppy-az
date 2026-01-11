using PetWebsite.API.Conventions;
using PetWebsite.API.Extensions;
using PetWebsite.Application;
using PetWebsite.Infrastructure;

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
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

var app = builder.Build();

// Seed database
await app.SeedDatabaseAsync();

// Configure middleware pipeline (order matters!)
app.UseResponseCompression();
app.UseResponseCaching();
app.UseRateLimiter();

app.ConfigureMiddleware();
app.ConfigureSwagger();

// app.UseHttpsRedirection();

app.MapControllers();

// Map health check endpoints
app.MapHealthCheckEndpoints();

app.Run();
