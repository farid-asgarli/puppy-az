using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Infrastructure.Persistence.Configurations;

/// <summary>
/// Entity type configuration for PetAd.
/// </summary>
public class PetAdConfiguration : IEntityTypeConfiguration<PetAd>
{
	public void Configure(EntityTypeBuilder<PetAd> builder)
	{
		builder.HasKey(e => e.Id);

		builder.Property(e => e.Title).IsRequired().HasMaxLength(200);

		builder.Property(e => e.Description).IsRequired().HasMaxLength(2000);

		builder.Property(e => e.AgeInMonths).IsRequired();

		builder.Property(e => e.Gender).IsRequired();

		builder.Property(e => e.AdType).IsRequired();

		builder.Property(e => e.Color).IsRequired().HasMaxLength(50);

		builder.Property(e => e.Weight).HasPrecision(8, 2);

		builder.Property(e => e.Size);

		builder.Property(e => e.Price).HasPrecision(18, 2);

		builder.Property(e => e.CityId).IsRequired();

		builder.Property(e => e.Status).IsRequired().HasDefaultValue(Domain.Enums.PetAdStatus.Pending);

		builder.Property(e => e.RejectionReason).HasMaxLength(500);

		builder.Property(e => e.IsAvailable).HasDefaultValue(true);

		builder.Property(e => e.IsPremium).HasDefaultValue(false);

		builder.Property(e => e.PremiumActivatedAt);

		builder.Property(e => e.PremiumExpiresAt);

		builder.Property(e => e.ViewCount).HasDefaultValue(0);

		builder.Property(e => e.IsDeleted).HasDefaultValue(false);

		builder.Property(e => e.CreatedAt).IsRequired();

		builder
			.HasMany(e => e.Images)
			.WithOne(e => e.PetAd!)
			.HasForeignKey(e => e.PetAdId)
			.OnDelete(DeleteBehavior.Cascade)
			.IsRequired(false); // Make navigation optional to work with query filters

		builder.HasOne(e => e.City).WithMany(c => c.PetAds).HasForeignKey(e => e.CityId).OnDelete(DeleteBehavior.Restrict);

		// User relationship is configured in UserConfiguration.cs to avoid duplication

		builder.HasIndex(e => e.PetBreedId);
		builder.HasIndex(e => e.CityId);
		builder.HasIndex(e => e.AdType);
		builder.HasIndex(e => e.Size);
		builder.HasIndex(e => e.Status);
		builder.HasIndex(e => e.IsAvailable);
		builder.HasIndex(e => e.IsPremium);
		builder.HasIndex(e => e.PremiumExpiresAt);
		builder.HasIndex(e => e.IsDeleted);
		builder.HasIndex(e => e.CreatedAt);
		builder.HasIndex(e => e.PublishedAt);
		builder.HasIndex(e => e.UserId);
	}
}
