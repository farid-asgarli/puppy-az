using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Infrastructure.Persistence.Configurations;

/// <summary>
/// Entity type configuration for PetBreed.
/// </summary>
public class PetBreedConfiguration : IEntityTypeConfiguration<PetBreed>
{
	public void Configure(EntityTypeBuilder<PetBreed> builder)
	{
		builder.HasKey(e => e.Id);

		builder.Property(e => e.IsActive).HasDefaultValue(true);

		builder.Property(e => e.IsDeleted).HasDefaultValue(false);

		builder.Property(e => e.CreatedAt).IsRequired();

		builder.HasMany(e => e.PetAds).WithOne(e => e.Breed).HasForeignKey(e => e.PetBreedId).OnDelete(DeleteBehavior.Restrict);

		builder.HasIndex(e => e.PetCategoryId);
		builder.HasIndex(e => e.IsDeleted);
	}
}
