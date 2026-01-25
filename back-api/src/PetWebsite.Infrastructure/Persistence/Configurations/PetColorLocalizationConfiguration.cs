using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Infrastructure.Persistence.Configurations;

public class PetColorLocalizationConfiguration : IEntityTypeConfiguration<PetColorLocalization>
{
	public void Configure(EntityTypeBuilder<PetColorLocalization> builder)
	{
		builder.ToTable("PetColorLocalizations");

		builder.HasKey(e => e.Id);

		builder.Property(e => e.Title).IsRequired().HasMaxLength(100);

		builder
			.HasOne(e => e.PetColor)
			.WithMany(c => c.Localizations)
			.HasForeignKey(e => e.PetColorId)
			.OnDelete(DeleteBehavior.Cascade)
			.IsRequired(false);

		builder.HasOne(e => e.AppLocale).WithMany().HasForeignKey(e => e.AppLocaleId).OnDelete(DeleteBehavior.Restrict);

		// Unique constraint: One localization per color per locale
		builder.HasIndex(e => new { e.PetColorId, e.AppLocaleId }).IsUnique();
	}
}
