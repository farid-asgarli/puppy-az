using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Infrastructure.Configuration;

public class PetAdViewConfiguration : IEntityTypeConfiguration<PetAdView>
{
	public void Configure(EntityTypeBuilder<PetAdView> builder)
	{
		builder.ToTable("PetAdViews");

		builder.HasKey(v => v.Id);

		builder.Property(v => v.UserId).IsRequired();

		builder.Property(v => v.PetAdId).IsRequired();

		builder.Property(v => v.ViewedAt).IsRequired();

		// Create indexes for efficient querying
		builder.HasIndex(v => new { v.UserId, v.ViewedAt });
		builder.HasIndex(v => new { v.UserId, v.PetAdId });
		builder.HasIndex(v => v.ViewedAt);

		// Relationships
		builder.HasOne(v => v.User).WithMany().HasForeignKey(v => v.UserId).OnDelete(DeleteBehavior.Cascade);

		builder.HasOne(v => v.PetAd).WithMany().HasForeignKey(v => v.PetAdId).OnDelete(DeleteBehavior.Cascade);

		// Query filter to exclude views for soft-deleted PetAds
		builder.HasQueryFilter(v => !v.PetAd.IsDeleted);
	}
}
