using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Infrastructure.Persistence.Configurations;

/// <summary>
/// Entity type configuration for PetAdTypeLocalization.
/// </summary>
public class PetAdTypeLocalizationConfiguration : IEntityTypeConfiguration<PetAdTypeLocalization>
{
	public void Configure(EntityTypeBuilder<PetAdTypeLocalization> builder)
	{
		builder.ToTable("PetAdTypeLocalizations");

		builder.HasKey(e => e.Id);

		builder.Property(e => e.Title).IsRequired().HasMaxLength(100);

		builder.Property(e => e.Description).HasMaxLength(500);

		builder
			.HasOne(e => e.PetAdType)
			.WithMany(c => c.Localizations)
			.HasForeignKey(e => e.PetAdTypeId)
			.OnDelete(DeleteBehavior.Cascade)
			.IsRequired(false);

		builder.HasOne(e => e.AppLocale).WithMany().HasForeignKey(e => e.AppLocaleId).OnDelete(DeleteBehavior.Restrict);

		// Unique constraint: One localization per type per locale
		builder.HasIndex(e => new { e.PetAdTypeId, e.AppLocaleId }).IsUnique();
	}
}
