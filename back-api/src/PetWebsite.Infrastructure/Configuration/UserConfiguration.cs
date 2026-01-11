using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Infrastructure.Configuration;

/// <summary>
/// Entity configuration for the User entity.
/// </summary>
public class UserConfiguration : IEntityTypeConfiguration<User>
{
	public void Configure(EntityTypeBuilder<User> builder)
	{
		builder.ToTable("Users");

		builder.HasKey(u => u.Id);

		builder.Property(u => u.FirstName).IsRequired().HasMaxLength(100);

		builder.Property(u => u.LastName).IsRequired().HasMaxLength(100);

		builder.Property(u => u.Email).IsRequired().HasMaxLength(256);

		builder.Property(u => u.UserName).IsRequired().HasMaxLength(256);

		builder.Property(u => u.RefreshToken).HasMaxLength(500);

		builder.Property(u => u.ProfilePictureUrl).HasMaxLength(1000);

		builder.Property(u => u.CreatedAt).IsRequired().HasDefaultValueSql("NOW()");

		builder.HasIndex(u => u.Email).IsUnique();

		builder.HasIndex(u => u.UserName).IsUnique();

		// Configure relationships
		builder.HasMany(u => u.PetAds).WithOne(p => p.User).HasForeignKey(p => p.UserId).OnDelete(DeleteBehavior.SetNull);

		builder.HasMany(u => u.FavoriteAds).WithOne(f => f.User).HasForeignKey(f => f.UserId).OnDelete(DeleteBehavior.Cascade);
	}
}
