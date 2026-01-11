using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Infrastructure.Persistence.Configurations;

/// <summary>
/// Entity type configuration for PetAdImage.
/// </summary>
public class PetAdImageConfiguration : IEntityTypeConfiguration<PetAdImage>
{
	public void Configure(EntityTypeBuilder<PetAdImage> builder)
	{
		builder.HasKey(e => e.Id);

		builder.Property(e => e.FilePath).IsRequired().HasMaxLength(500);

		builder.Property(e => e.FileName).IsRequired().HasMaxLength(255);

		builder.Property(e => e.FileSize).IsRequired();

		builder.Property(e => e.ContentType).IsRequired().HasMaxLength(100);

		builder.Property(e => e.IsPrimary).HasDefaultValue(false);

		builder.Property(e => e.UploadedAt).IsRequired();

		builder.Property(e => e.UploadedById).IsRequired();

		builder.Property(e => e.AttachedAt).IsRequired(false);

		// PetAdId is now nullable to support orphaned images
		builder.Property(e => e.PetAdId).IsRequired(false);

		// Relationship with User (uploader)
		builder
			.HasOne(e => e.UploadedBy)
			.WithMany(u => u.UploadedImages)
			.HasForeignKey(e => e.UploadedById)
			.OnDelete(DeleteBehavior.Restrict); // Don't cascade delete images if user is deleted

		// Relationship with PetAd (optional, for orphaned images)
		builder.HasOne(e => e.PetAd).WithMany(p => p.Images).HasForeignKey(e => e.PetAdId).OnDelete(DeleteBehavior.Cascade); // Delete images when pet ad is deleted

		// Indexes for efficient queries
		builder.HasIndex(e => e.PetAdId);
		builder.HasIndex(e => e.UploadedById);
		builder.HasIndex(e => e.IsPrimary);
		builder.HasIndex(e => new { e.UploadedById, e.PetAdId }); // For ownership + attachment queries
		builder.HasIndex(e => new { e.UploadedAt, e.PetAdId }); // For orphan cleanup queries
	}
}
