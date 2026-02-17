using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Infrastructure.Persistence.Configurations;

/// <summary>
/// Entity type configuration for PetAdTypeEntity.
/// </summary>
public class PetAdTypeConfiguration : IEntityTypeConfiguration<PetAdTypeEntity>
{
	public void Configure(EntityTypeBuilder<PetAdTypeEntity> builder)
	{
		builder.ToTable("PetAdTypes");

		builder.HasKey(e => e.Id);

		builder.Property(e => e.Key).IsRequired().HasMaxLength(50);

		builder.Property(e => e.Emoji).IsRequired().HasMaxLength(10);

		builder.Property(e => e.IconName).HasMaxLength(100);

		builder.Property(e => e.BackgroundColor).IsRequired().HasMaxLength(50);

		builder.Property(e => e.TextColor).IsRequired().HasMaxLength(50);

		builder.Property(e => e.BorderColor).IsRequired().HasMaxLength(50);

		builder.Property(e => e.SortOrder).HasDefaultValue(0);

		builder.Property(e => e.IsActive).HasDefaultValue(true);

		builder.Property(e => e.IsDeleted).HasDefaultValue(false);

		builder.Property(e => e.CreatedAt).IsRequired();

		builder.HasIndex(e => e.Key).IsUnique();

		builder.HasIndex(e => e.SortOrder);

		builder.HasIndex(e => e.IsDeleted);
	}
}
