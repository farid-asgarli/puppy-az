using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Infrastructure.Persistence.Configurations;

public class AppLocaleConfiguration : IEntityTypeConfiguration<AppLocale>
{
	public void Configure(EntityTypeBuilder<AppLocale> builder)
	{
		builder.ToTable("AppLocales");

		builder.HasKey(e => e.Id);

		builder.Property(e => e.Code).IsRequired().HasMaxLength(10);

		builder.HasIndex(e => e.Code).IsUnique();

		builder.Property(e => e.Name).IsRequired().HasMaxLength(100);

		builder.Property(e => e.NativeName).IsRequired().HasMaxLength(100);

		builder.Property(e => e.IsActive).HasDefaultValue(true);

		builder.Property(e => e.IsDefault).HasDefaultValue(false);
	}
}
