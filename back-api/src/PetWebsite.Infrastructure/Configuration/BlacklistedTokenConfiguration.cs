using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Infrastructure.Configuration;

/// <summary>
/// Entity Framework configuration for BlacklistedToken entity.
/// </summary>
public class BlacklistedTokenConfiguration : IEntityTypeConfiguration<BlacklistedToken>
{
	public void Configure(EntityTypeBuilder<BlacklistedToken> builder)
	{
		builder.ToTable("BlacklistedTokens");

		builder.HasKey(b => b.Id);

		builder.Property(b => b.TokenId).IsRequired().HasMaxLength(100);

		builder.Property(b => b.UserType).IsRequired().HasMaxLength(50);

		builder.Property(b => b.BlacklistedAt).IsRequired();

		builder.Property(b => b.ExpiresAt).IsRequired();

		builder.Property(b => b.Reason).HasMaxLength(200);

		// Create index on TokenId for fast lookups
		builder.HasIndex(b => b.TokenId).IsUnique();

		// Create index on ExpiresAt for cleanup operations
		builder.HasIndex(b => b.ExpiresAt);

		// Create index on UserId for user-specific queries
		builder.HasIndex(b => b.UserId);
	}
}
