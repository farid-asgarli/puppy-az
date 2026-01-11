using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Infrastructure.Persistence.Configurations;

/// <summary>
/// Entity type configuration for FavoriteAd.
/// </summary>
public class FavoriteAdConfiguration : IEntityTypeConfiguration<FavoriteAd>
{
	public void Configure(EntityTypeBuilder<FavoriteAd> builder)
	{
		// Composite primary key
		builder.HasKey(f => new { f.UserId, f.PetAdId });

		builder.Property(f => f.CreatedAt).IsRequired().HasDefaultValueSql("NOW()");

		// Configure relationships
		builder.HasOne(f => f.User).WithMany(u => u.FavoriteAds).HasForeignKey(f => f.UserId).OnDelete(DeleteBehavior.Cascade);

		builder.HasOne(f => f.PetAd).WithMany().HasForeignKey(f => f.PetAdId).OnDelete(DeleteBehavior.Cascade);

		// Indexes
		builder.HasIndex(f => f.UserId);
		builder.HasIndex(f => f.PetAdId);
		builder.HasIndex(f => f.CreatedAt);

		// Query filter to exclude favorites for soft-deleted PetAds
		builder.HasQueryFilter(f => !f.PetAd.IsDeleted);
	}
}
