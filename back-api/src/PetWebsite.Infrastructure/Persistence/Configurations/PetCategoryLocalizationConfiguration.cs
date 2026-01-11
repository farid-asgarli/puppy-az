using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Infrastructure.Persistence.Configurations;

public class PetCategoryLocalizationConfiguration : IEntityTypeConfiguration<PetCategoryLocalization>
{
	public void Configure(EntityTypeBuilder<PetCategoryLocalization> builder)
	{
		builder.ToTable("PetCategoryLocalizations");

		builder.HasKey(e => e.Id);

		builder.Property(e => e.Title).IsRequired().HasMaxLength(100);

		builder.Property(e => e.Subtitle).IsRequired().HasMaxLength(200);

		builder
			.HasOne(e => e.PetCategory)
			.WithMany(c => c.Localizations)
			.HasForeignKey(e => e.PetCategoryId)
			.OnDelete(DeleteBehavior.Cascade)
			.IsRequired(false); // Make navigation optional to work with query filters

		builder.HasOne(e => e.AppLocale).WithMany().HasForeignKey(e => e.AppLocaleId).OnDelete(DeleteBehavior.Restrict);

		// Unique constraint: One localization per category per locale
		builder.HasIndex(e => new { e.PetCategoryId, e.AppLocaleId }).IsUnique();
	}
}
