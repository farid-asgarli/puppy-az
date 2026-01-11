using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Infrastructure.Persistence.Configurations;

/// <summary>
/// Entity type configuration for City.
/// </summary>
public class CityConfiguration : IEntityTypeConfiguration<City>
{
	public void Configure(EntityTypeBuilder<City> builder)
	{
		builder.HasKey(e => e.Id);

		builder.Property(e => e.Name).IsRequired().HasMaxLength(100);

		builder.Property(e => e.IsActive).HasDefaultValue(true);

		builder.Property(e => e.IsDeleted).HasDefaultValue(false);

		builder.Property(e => e.CreatedAt).IsRequired();

		builder.HasMany(e => e.PetAds).WithOne(e => e.City).HasForeignKey(e => e.CityId).OnDelete(DeleteBehavior.Restrict);

		builder.HasIndex(e => e.Name);
		builder.HasIndex(e => e.IsActive);
		builder.HasIndex(e => e.IsDeleted);
	}
}
