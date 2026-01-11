using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Infrastructure.Persistence.Configurations;

/// <summary>
/// Entity type configuration for PetCategory.
/// </summary>
public class PetCategoryConfiguration : IEntityTypeConfiguration<PetCategory>
{
	public void Configure(EntityTypeBuilder<PetCategory> builder)
	{
		builder.HasKey(e => e.Id);

		builder.Property(e => e.SvgIcon).IsRequired();

		builder.Property(e => e.IconColor).IsRequired().HasMaxLength(50);

		builder.Property(e => e.BackgroundColor).IsRequired().HasMaxLength(50);

		builder.Property(e => e.IsActive).HasDefaultValue(true);

		builder.Property(e => e.IsDeleted).HasDefaultValue(false);

		builder.Property(e => e.CreatedAt).IsRequired();

		builder.HasMany(e => e.Breeds).WithOne(e => e.Category).HasForeignKey(e => e.PetCategoryId).OnDelete(DeleteBehavior.Restrict);

		builder.HasIndex(e => e.IsDeleted);
	}
}
