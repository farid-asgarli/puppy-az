using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Infrastructure.Persistence.Configurations;

/// <summary>
/// Entity type configuration for District.
/// </summary>
public class DistrictConfiguration : IEntityTypeConfiguration<District>
{
	public void Configure(EntityTypeBuilder<District> builder)
	{
		builder.HasKey(e => e.Id);

		builder.Property(e => e.NameAz).IsRequired().HasMaxLength(100);
		builder.Property(e => e.NameEn).IsRequired().HasMaxLength(100);
		builder.Property(e => e.NameRu).IsRequired().HasMaxLength(100);

		builder.Property(e => e.DisplayOrder).HasDefaultValue(0);
		builder.Property(e => e.IsActive).HasDefaultValue(true);
		builder.Property(e => e.IsDeleted).HasDefaultValue(false);
		builder.Property(e => e.CreatedAt).IsRequired();

		builder.HasOne(e => e.City)
			.WithMany(c => c.Districts)
			.HasForeignKey(e => e.CityId)
			.OnDelete(DeleteBehavior.Restrict);

		builder.HasMany(e => e.PetAds)
			.WithOne(e => e.District!)
			.HasForeignKey(e => e.DistrictId)
			.OnDelete(DeleteBehavior.SetNull)
			.IsRequired(false);

		builder.HasIndex(e => e.CityId);
		builder.HasIndex(e => e.NameAz);
		builder.HasIndex(e => e.IsActive);
		builder.HasIndex(e => e.IsDeleted);
		builder.HasIndex(e => e.DisplayOrder);
	}
}
