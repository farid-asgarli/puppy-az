using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Infrastructure.Persistence.Configurations;

public class PetBreedLocalizationConfiguration : IEntityTypeConfiguration<PetBreedLocalization>
{
	public void Configure(EntityTypeBuilder<PetBreedLocalization> builder)
	{
		builder.ToTable("PetBreedLocalizations");

		builder.HasKey(e => e.Id);

		builder.Property(e => e.Title).IsRequired().HasMaxLength(100);

		builder
			.HasOne(e => e.PetBreed)
			.WithMany(b => b.Localizations)
			.HasForeignKey(e => e.PetBreedId)
			.OnDelete(DeleteBehavior.Cascade)
			.IsRequired(false); // Make navigation optional to work with query filters

		builder.HasOne(e => e.AppLocale).WithMany().HasForeignKey(e => e.AppLocaleId).OnDelete(DeleteBehavior.Restrict);

		// Unique constraint: One localization per breed per locale
		builder.HasIndex(e => new { e.PetBreedId, e.AppLocaleId }).IsUnique();
	}
}
