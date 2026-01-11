using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Infrastructure.Configuration;

/// <summary>
/// Entity configuration for the AdminUser entity.
/// </summary>
public class AdminUserConfiguration : IEntityTypeConfiguration<AdminUser>
{
	public void Configure(EntityTypeBuilder<AdminUser> builder)
	{
		// This is the primary Identity user, so it should use the default AspNetUsers table
		builder.ToTable("AspNetUsers");

		builder.HasKey(u => u.Id);

		builder.Property(u => u.FirstName).IsRequired().HasMaxLength(100);

		builder.Property(u => u.LastName).IsRequired().HasMaxLength(100);

		builder.Property(u => u.Email).HasMaxLength(256);

		builder.Property(u => u.UserName).HasMaxLength(256);

		builder.Property(u => u.RefreshToken).HasMaxLength(500);

		builder.Property(u => u.CreatedAt).IsRequired().HasDefaultValueSql("NOW()");

		builder.Property(u => u.IsActive).IsRequired().HasDefaultValue(true);

		// Indexes are already created by Identity, but we can add specific business indexes
		builder.HasIndex(u => u.IsActive);
	}
}
