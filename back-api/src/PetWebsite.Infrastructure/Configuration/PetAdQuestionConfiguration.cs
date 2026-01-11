using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Infrastructure.Configuration;

public class PetAdQuestionConfiguration : IEntityTypeConfiguration<PetAdQuestion>
{
	public void Configure(EntityTypeBuilder<PetAdQuestion> builder)
	{
		builder.ToTable("PetAdQuestions");

		builder.HasKey(q => q.Id);

		builder.Property(q => q.Question).IsRequired().HasMaxLength(1000);

		builder.Property(q => q.Answer).HasMaxLength(2000);

		builder.Property(q => q.IsDeleted).HasDefaultValue(false);

		builder.HasIndex(q => q.PetAdId);
		builder.HasIndex(q => q.UserId);
		builder.HasIndex(q => q.CreatedAt);

		// Relationships
		builder.HasOne(q => q.PetAd).WithMany(p => p.Questions).HasForeignKey(q => q.PetAdId).OnDelete(DeleteBehavior.Cascade);

		builder.HasOne(q => q.User).WithMany().HasForeignKey(q => q.UserId).OnDelete(DeleteBehavior.Restrict);

		// Query filters to exclude questions for soft-deleted PetAds and soft-deleted questions
		builder.HasQueryFilter(q => !q.IsDeleted && !q.PetAd.IsDeleted);
	}
}
