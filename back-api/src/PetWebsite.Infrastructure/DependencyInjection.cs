using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using PetWebsite.Application.Common.Configuration;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Domain.Entities;
using PetWebsite.Infrastructure.Configuration;
using PetWebsite.Infrastructure.Persistence;
using PetWebsite.Infrastructure.Persistence.Interceptors;
using PetWebsite.Infrastructure.Services;
using PetWebsite.Infrastructure.Services.Authentication;
using PetWebsite.Infrastructure.Services.Communication;
using PetWebsite.Infrastructure.Services.Files;
using PetWebsite.Infrastructure.Services.Identity;
using PetWebsite.Infrastructure.Services.Images;

namespace PetWebsite.Infrastructure;

public static class DependencyInjection
{
	public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
	{
		Console.WriteLine("[DEBUG-INFRA] Starting Infrastructure registration...");
		
		// Register interceptors
		services.AddScoped<AuditableEntityInterceptor>();
		Console.WriteLine("[DEBUG-INFRA] AuditableEntityInterceptor registered");

		// Log connection string (masked)
		var connString = configuration.GetConnectionString("DefaultConnection");
		var maskedConn = connString != null 
			? $"Host={connString.Split(';').FirstOrDefault(s => s.StartsWith("Host="))}..." 
			: "NULL";
		Console.WriteLine($"[DEBUG-INFRA] Connection string: {maskedConn}");

		// Add DbContext with PostgreSQL and register interface
		services.AddDbContext<IApplicationDbContext, ApplicationDbContext>(
			(serviceProvider, options) =>
			{
				Console.WriteLine("[DEBUG-INFRA] Configuring DbContext...");
				var auditableInterceptor = serviceProvider.GetRequiredService<AuditableEntityInterceptor>();

				options
					.UseNpgsql(
						configuration.GetConnectionString("DefaultConnection"),
						b => b.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName)
					)
					.AddInterceptors(auditableInterceptor)
					.EnableDetailedErrors()
					.EnableSensitiveDataLogging();
				Console.WriteLine("[DEBUG-INFRA] DbContext configured with PostgreSQL");
			}
		);
		Console.WriteLine("[DEBUG-INFRA] DbContext registration complete");

		// Register Common.Repository services for dynamic querying
		services.AddScoped<Common.Repository.Abstraction.IGenericFiltering, Common.Repository.Implementation.GenericFiltering>();
		services.AddScoped<
			Common.Repository.Abstraction.IDynamicQueryRepository,
			Common.Repository.Implementation.DynamicQueryRepository
		>();

		// Configure Primary Identity for Admin Users
		// AdminUser is the primary Identity entity that uses the standard AspNetUsers table
		// and has full access to all Identity features (roles, claims, tokens, etc.)
		services
			.AddIdentityCore<AdminUser>(options =>
			{
				// Password settings - Strong security for admin accounts
				options.Password.RequireDigit = true;
				options.Password.RequireLowercase = true;
				options.Password.RequireUppercase = true;
				options.Password.RequireNonAlphanumeric = true;
				options.Password.RequiredLength = 8;

				// Lockout settings
				options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(30);
				options.Lockout.MaxFailedAccessAttempts = 5;
				options.Lockout.AllowedForNewUsers = true;

				// User settings
				options.User.RequireUniqueEmail = true;
			})
			.AddRoles<IdentityRole<Guid>>()
			.AddEntityFrameworkStores<ApplicationDbContext>()
			.AddUserManager<UserManager<AdminUser>>()
			.AddRoleManager<RoleManager<IdentityRole<Guid>>>();

		// Configure Secondary Identity for Regular Users (Consumers)
		// User is stored in a separate "Users" table and manages its own authentication
		// It does NOT use the AspNetRoles/Claims/Tokens tables to avoid FK conflicts
		services
			.AddIdentityCore<User>(options =>
			{
				// Password settings - Slightly relaxed for consumers
				options.Password.RequireDigit = true;
				options.Password.RequireLowercase = true;
				options.Password.RequireUppercase = false;
				options.Password.RequireNonAlphanumeric = false;
				options.Password.RequiredLength = 6;

				// Lockout settings
				options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
				options.Lockout.MaxFailedAccessAttempts = 5;
				options.Lockout.AllowedForNewUsers = true;

				// User settings
				options.User.RequireUniqueEmail = true;
				options.SignIn.RequireConfirmedEmail = false; // Set to true in production with email service
			})
			.AddEntityFrameworkStores<ApplicationDbContext>()
			.AddUserManager<UserManager<User>>();

		// Configure JWT settings
		services.Configure<JwtSettings>(configuration.GetSection(JwtSettings.SectionName));

		// Register JWT Token Service
		services.AddScoped<IJwtTokenService, JwtTokenService>();

		// Register Token Blacklist Service
		services.AddScoped<ITokenBlacklistService, TokenBlacklistService>();

		// Configure File Storage options
		services.Configure<FileStorageOptions>(configuration.GetSection(FileStorageOptions.SectionName));

		// Register File Service dependencies
		services.AddSingleton<IFileValidator, FileValidator>();
		services.AddSingleton<IFileSystemWrapper, FileSystemWrapper>();
		services.AddSingleton<IChecksumService, ChecksumService>();
		services.AddSingleton<IContentTypeProvider, ContentTypeProvider>();
		services.AddScoped<IFileService, FileService>();

		// Configure Image Processing options
		services.Configure<ImageProcessingOptions>(configuration.GetSection(ImageProcessingOptions.SectionName));

		// Register Image Processing Service
		services.AddSingleton<IImageProcessingService, ImageProcessingService>();

		// Configure SMS settings
		services.Configure<SmsSettings>(configuration.GetSection(SmsSettings.SectionName));

		// Register SMS Service
		services.AddHttpClient(); // Required for SMS service HTTP calls
		services.AddScoped<ISmsService, SmsService>();
		services.AddScoped<ISmsVerificationService, SmsVerificationService>();

		// Register Current User Service
		services.AddScoped<ICurrentUserService, CurrentUserService>();

		// Register URL Service
		services.AddScoped<IUrlService, UrlService>();

		return services;
	}
}
