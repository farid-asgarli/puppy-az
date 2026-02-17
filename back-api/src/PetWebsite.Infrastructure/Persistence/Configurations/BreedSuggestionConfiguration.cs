using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Infrastructure.Persistence.Configurations;

/// <summary>
/// Entity type configuration for BreedSuggestion.
/// </summary>
public class BreedSuggestionConfiguration : IEntityTypeConfiguration<BreedSuggestion>
{
	public void Configure(EntityTypeBuilder<BreedSuggestion> builder)
	{
		builder.HasKey(e => e.Id);

		builder.Property(e => e.Name)
			.IsRequired()
			.HasMaxLength(100);

		builder.Property(e => e.Status)
			.HasDefaultValue(BreedSuggestionStatus.Pending);

		builder.Property(e => e.AdminNote)
			.HasMaxLength(500);

		builder.Property(e => e.CreatedAt).IsRequired();

		builder.HasOne(e => e.Category)
			.WithMany()
			.HasForeignKey(e => e.PetCategoryId)
			.OnDelete(DeleteBehavior.Restrict);

		builder.HasOne(e => e.User)
			.WithMany()
			.HasForeignKey(e => e.UserId)
			.OnDelete(DeleteBehavior.SetNull);

		builder.HasOne(e => e.ApprovedBreed)
			.WithMany()
			.HasForeignKey(e => e.ApprovedBreedId)
			.OnDelete(DeleteBehavior.SetNull);

		builder.HasIndex(e => e.Status);
		builder.HasIndex(e => e.PetCategoryId);
	}
}
