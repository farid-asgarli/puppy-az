using System.Linq.Expressions;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Domain.Common;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Infrastructure.Persistence;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
	: IdentityDbContext<AdminUser, IdentityRole<Guid>, Guid>(options),
		IApplicationDbContext
{
	// Interface-required DbSets
	public DbSet<AppLocale> AppLocales { get; set; } = null!;
	public DbSet<PetCategory> PetCategories { get; set; } = null!;
	public DbSet<PetCategoryLocalization> PetCategoryLocalizations { get; set; } = null!;
	public DbSet<PetBreed> PetBreeds { get; set; } = null!;
	public DbSet<PetBreedLocalization> PetBreedLocalizations { get; set; } = null!;
	public DbSet<City> Cities { get; set; } = null!;
	public DbSet<PetAd> PetAds { get; set; } = null!;
	public DbSet<PetAdImage> PetAdImages { get; set; } = null!;
	public DbSet<PetAdView> PetAdViews { get; set; } = null!;
	public DbSet<FavoriteAd> FavoriteAds { get; set; } = null!;
	public DbSet<PetAdQuestion> PetAdQuestions { get; set; } = null!;
	public DbSet<BlacklistedToken> BlacklistedTokens { get; set; } = null!;

	// Regular users (consumers) - not exposed via interface
	public DbSet<User> RegularUsers { get; set; } = null!;
	public DbSet<SmsVerificationCode> SmsVerificationCodes { get; set; } = null!;

	protected override void OnModelCreating(ModelBuilder modelBuilder)
	{
		base.OnModelCreating(modelBuilder);

		// Apply all entity configurations from the current assembly
		modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);

		// Configure custom table names for Identity entities
		ConfigureIdentityTableNames(modelBuilder);

		// Configure Identity tables to work only with AdminUser
		ConfigureIdentityRelationships(modelBuilder);

		// Apply global query filter for soft-deleted entities
		ApplySoftDeleteQueryFilters(modelBuilder);
	}

	/// <summary>
	/// Configures custom table names for Identity entities, removing the AspNet prefix.
	/// </summary>
	private static void ConfigureIdentityTableNames(ModelBuilder modelBuilder)
	{
		// Admin users table
		modelBuilder.Entity<AdminUser>().ToTable("Admins");

		// Admin-related Identity tables (prefixed with Admin for clarity)
		modelBuilder.Entity<IdentityRole<Guid>>().ToTable("AdminRoles");
		modelBuilder.Entity<IdentityUserRole<Guid>>().ToTable("AdminUserRoles");
		modelBuilder.Entity<IdentityUserClaim<Guid>>().ToTable("AdminUserClaims");
		modelBuilder.Entity<IdentityUserLogin<Guid>>().ToTable("AdminUserLogins");
		modelBuilder.Entity<IdentityUserToken<Guid>>().ToTable("AdminUserTokens");
		modelBuilder.Entity<IdentityRoleClaim<Guid>>().ToTable("AdminRoleClaims");

		// Regular users table (clean name, no prefix needed)
		modelBuilder.Entity<User>().ToTable("RegularUsers");
	}

	/// <summary>
	/// Configures Identity table relationships to work only with AdminUser.
	/// This prevents FK conflicts when User (regular users) are in a separate table.
	/// </summary>
	private static void ConfigureIdentityRelationships(ModelBuilder modelBuilder)
	{
		modelBuilder
			.Entity<IdentityUserClaim<Guid>>()
			.HasOne<AdminUser>()
			.WithMany()
			.HasForeignKey(uc => uc.UserId)
			.IsRequired()
			.OnDelete(DeleteBehavior.Cascade);

		modelBuilder
			.Entity<IdentityUserLogin<Guid>>()
			.HasOne<AdminUser>()
			.WithMany()
			.HasForeignKey(ul => ul.UserId)
			.IsRequired()
			.OnDelete(DeleteBehavior.Cascade);

		modelBuilder
			.Entity<IdentityUserToken<Guid>>()
			.HasOne<AdminUser>()
			.WithMany()
			.HasForeignKey(ut => ut.UserId)
			.IsRequired()
			.OnDelete(DeleteBehavior.Cascade);

		modelBuilder
			.Entity<IdentityUserRole<Guid>>()
			.HasOne<AdminUser>()
			.WithMany()
			.HasForeignKey(ur => ur.UserId)
			.IsRequired()
			.OnDelete(DeleteBehavior.Cascade);
	}

	/// <summary>
	/// Applies global query filters to exclude soft-deleted entities from queries.
	/// </summary>
	private static void ApplySoftDeleteQueryFilters(ModelBuilder modelBuilder)
	{
		foreach (var entityType in modelBuilder.Model.GetEntityTypes())
		{
			if (!typeof(SoftDeletableEntity).IsAssignableFrom(entityType.ClrType))
				continue;

			// Create expression: entity => !entity.IsDeleted
			var parameter = Expression.Parameter(entityType.ClrType, "e");
			var property = Expression.Property(parameter, nameof(SoftDeletableEntity.IsDeleted));
			var filter = Expression.Lambda(Expression.Not(property), parameter);

			modelBuilder.Entity(entityType.ClrType).HasQueryFilter(filter);
		}
	}
}
