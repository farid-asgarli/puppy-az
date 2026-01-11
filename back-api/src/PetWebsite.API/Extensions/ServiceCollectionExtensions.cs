using System.Globalization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Localization;
using Microsoft.Extensions.Localization;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using PetWebsite.Application.Common.Configuration;
using PetWebsite.Infrastructure.Localization;
using PetWebsite.Infrastructure.Services.Authentication;

namespace PetWebsite.API.Extensions;

public static class ServiceCollectionExtensions
{
	public static IServiceCollection AddCorsConfiguration(
		this IServiceCollection services,
		IConfiguration configuration,
		IWebHostEnvironment environment
	)
	{
		services.AddCors(options =>
		{
			if (environment.IsDevelopment())
			{
				// Development: Allow localhost origins
				options.AddPolicy(
					"AllowedOrigins",
					policy =>
					{
						policy
							.WithOrigins(
								"http://localhost:3000",
								"http://localhost:3001",
								"http://localhost:4200",
								"http://localhost:5173",
								"http://localhost:8080"
							)
							.AllowAnyMethod()
							.AllowAnyHeader()
							.AllowCredentials()
							.WithExposedHeaders("X-Pagination", "X-Total-Count");
					}
				);
			}
			else
			{
				// Production: Read from configuration
				var allowedOrigins = configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? Array.Empty<string>();

				options.AddPolicy(
					"AllowedOrigins",
					policy =>
					{
						policy
							.WithOrigins(allowedOrigins)
							.AllowAnyMethod()
							.AllowAnyHeader()
							.AllowCredentials()
							.WithExposedHeaders("X-Pagination", "X-Total-Count");
					}
				);
			}
		});

		return services;
	}

	public static IServiceCollection AddLocalizationConfiguration(this IServiceCollection services, IWebHostEnvironment environment)
	{
		var resourcesPath = Path.Combine(environment.ContentRootPath, "Resources");
		services.AddSingleton<IStringLocalizerFactory>(sp =>
		{
			var loggerFactory = sp.GetRequiredService<ILoggerFactory>();
			return new JsonStringLocalizerFactory(resourcesPath, loggerFactory);
		});
		services.AddSingleton(sp =>
		{
			var factory = sp.GetRequiredService<IStringLocalizerFactory>();
			return factory.Create(typeof(Program));
		});

		// Register generic IStringLocalizer<T>
		services.AddTransient(typeof(IStringLocalizer<>), typeof(StringLocalizer<>));

		var supportedCultures = new[] { new CultureInfo("en"), new CultureInfo("ru"), new CultureInfo("az") };
		services.Configure<RequestLocalizationOptions>(options =>
		{
			options.DefaultRequestCulture = new RequestCulture("en");
			options.SupportedCultures = supportedCultures;
			options.SupportedUICultures = supportedCultures;
			options.RequestCultureProviders =
			[
				new QueryStringRequestCultureProvider(),
				new CookieRequestCultureProvider(),
				new AcceptLanguageHeaderRequestCultureProvider(),
			];
		});

		return services;
	}

	public static IServiceCollection AddProblemDetailsConfiguration(this IServiceCollection services)
	{
		services.AddProblemDetails(options =>
		{
			// Customize ProblemDetails globally
			options.CustomizeProblemDetails = context =>
			{
				// Add trace ID for debugging
				context.ProblemDetails.Extensions["traceId"] = context.HttpContext.TraceIdentifier;

				// Add instance path
				context.ProblemDetails.Instance = context.HttpContext.Request.Path;

				// Add timestamp for tracking
				context.ProblemDetails.Extensions["timestamp"] = DateTime.UtcNow;
			};
		});

		return services;
	}

	public static IServiceCollection AddSwaggerConfiguration(this IServiceCollection services)
	{
		services.AddSwaggerGen(options =>
		{
			// Use full type name to avoid schema ID conflicts
			options.CustomSchemaIds(type => type.FullName?.Replace("+", "."));

			// Add ProblemDetails operation filter
			options.OperationFilter<PetWebsite.API.Filters.ProblemDetailsOperationFilter>();

			// User API Documentation
			options.SwaggerDoc(
				"user",
				new OpenApiInfo
				{
					Title = "Pet Website - User API",
					Version = "v1",
					Description = "Public and user-facing endpoints for browsing pets, managing user profiles, and pet advertisements.",
					Contact = new OpenApiContact { Name = "Pet Website Team", Email = "support@petwebsite.com" },
				}
			);

			// Admin API Documentation
			options.SwaggerDoc(
				"admin",
				new OpenApiInfo
				{
					Title = "Pet Website - Admin API",
					Version = "v1",
					Description = "Administrative endpoints for managing users, pets, categories, breeds, and system configuration.",
					Contact = new OpenApiContact { Name = "Pet Website Team", Email = "support@petwebsite.com" },
				}
			);

			// Filter controllers by route to assign them to the correct Swagger document
			options.DocInclusionPredicate(
				(docName, apiDesc) =>
				{
					var routeTemplate = apiDesc.RelativePath?.ToLower() ?? string.Empty;

					return docName switch
					{
						"admin" => routeTemplate.StartsWith("api/admin/"),
						"user" => !routeTemplate.StartsWith("api/admin/"),
						_ => false,
					};
				}
			);

			options.AddSecurityDefinition(
				"Bearer",
				new OpenApiSecurityScheme
				{
					Name = "Authorization",
					Type = SecuritySchemeType.Http,
					Scheme = "Bearer",
					BearerFormat = "JWT",
					In = ParameterLocation.Header,
					Description = "JWT Authorization header using the Bearer scheme. Enter 'Bearer' [space] and then your token.",
				}
			);

			options.AddSecurityRequirement(
				new OpenApiSecurityRequirement
				{
					{
						new OpenApiSecurityScheme
						{
							Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" },
						},
						Array.Empty<string>()
					},
				}
			);

			// Map ProblemDetails to Swagger responses
			options.MapType<Microsoft.AspNetCore.Mvc.ProblemDetails>(
				() =>
					new OpenApiSchema
					{
						Type = "object",
						Properties = new Dictionary<string, OpenApiSchema>
						{
							["type"] = new OpenApiSchema
							{
								Type = "string",
								Description = "A URI reference that identifies the problem type",
							},
							["title"] = new OpenApiSchema
							{
								Type = "string",
								Description = "A short, human-readable summary of the problem",
							},
							["status"] = new OpenApiSchema
							{
								Type = "integer",
								Format = "int32",
								Description = "The HTTP status code",
							},
							["detail"] = new OpenApiSchema
							{
								Type = "string",
								Description = "A human-readable explanation specific to this occurrence",
							},
							["instance"] = new OpenApiSchema
							{
								Type = "string",
								Description = "A URI reference that identifies the specific occurrence",
							},
							["traceId"] = new OpenApiSchema { Type = "string", Description = "The trace identifier for debugging" },
							["errors"] = new OpenApiSchema
							{
								Type = "object",
								Description = "Validation errors grouped by field name",
								AdditionalPropertiesAllowed = true,
							},
						},
						Example = new Microsoft.OpenApi.Any.OpenApiObject
						{
							["type"] = new Microsoft.OpenApi.Any.OpenApiString("https://tools.ietf.org/html/rfc7231#section-6.5.1"),
							["title"] = new Microsoft.OpenApi.Any.OpenApiString("Bad Request"),
							["status"] = new Microsoft.OpenApi.Any.OpenApiInteger(400),
							["detail"] = new Microsoft.OpenApi.Any.OpenApiString("One or more validation errors occurred."),
							["traceId"] = new Microsoft.OpenApi.Any.OpenApiString("00-abc123-def456-01"),
						},
					}
			);
		});

		return services;
	}

	public static IServiceCollection AddJwtAuthentication(
		this IServiceCollection services,
		IConfiguration configuration,
		IWebHostEnvironment environment
	)
	{
		var jwtSettings =
			configuration.GetSection(JwtSettings.SectionName).Get<JwtSettings>()
			?? throw new InvalidOperationException("JWT settings are not configured");

		if (jwtSettings.PublicSecurityKey is null)
		{
			throw new InvalidOperationException(
				"JWT configuration error: PublicSecurityKey (RSA public key) must be configured in appsettings.json"
			);
		}

		var rsaKey = RsaSignature.GetKeyFromJson(jwtSettings.PublicSecurityKey);

		services
			.AddAuthentication(options =>
			{
				options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
				options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
			})
			.AddJwtBearer(options =>
			{
				options.SaveToken = true;
				options.RequireHttpsMetadata = environment.IsProduction();
				options.TokenValidationParameters = new TokenValidationParameters
				{
					ValidateIssuer = true,
					ValidateAudience = true,
					ValidateLifetime = true,
					ValidateIssuerSigningKey = true,
					ValidIssuer = jwtSettings.Issuer,
					ValidAudience = jwtSettings.Audience,
					IssuerSigningKey = rsaKey,
					ClockSkew = TimeSpan.Zero,
				};

				options.Events = new JwtBearerEvents
				{
					OnMessageReceived = context =>
					{
						var token = context.Request.Headers.Authorization.FirstOrDefault()?.Split(" ").Last();

						if (string.IsNullOrEmpty(token))
						{
							token = context.Request.Cookies["accessToken"];
						}

						if (!string.IsNullOrEmpty(token))
						{
							context.Token = token;
						}

						return Task.CompletedTask;
					},
				};
			});

		services.AddAuthorization();

		return services;
	}
}
