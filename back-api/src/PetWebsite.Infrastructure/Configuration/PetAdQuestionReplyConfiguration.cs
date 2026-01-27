using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Infrastructure.Configuration;

public class PetAdQuestionReplyConfiguration : IEntityTypeConfiguration<PetAdQuestionReply>
{
	public void Configure(EntityTypeBuilder<PetAdQuestionReply> builder)
	{
		builder.ToTable("PetAdQuestionReplies");

		builder.HasKey(r => r.Id);

		builder.Property(r => r.Text)
			.IsRequired()
			.HasMaxLength(1000);

		builder.Property(r => r.IsOwnerReply)
			.IsRequired()
			.HasDefaultValue(false);

		builder.Property(r => r.IsDeleted)
			.IsRequired()
			.HasDefaultValue(false);

		// Relationships
		builder.HasOne(r => r.Question)
			.WithMany(q => q.Replies)
			.HasForeignKey(r => r.QuestionId)
			.OnDelete(DeleteBehavior.Cascade);

		builder.HasOne(r => r.User)
			.WithMany()
			.HasForeignKey(r => r.UserId)
			.OnDelete(DeleteBehavior.Restrict);

		// Indexes
		builder.HasIndex(r => r.QuestionId);
		builder.HasIndex(r => r.UserId);
		builder.HasIndex(r => new { r.QuestionId, r.CreatedAt });
	}
}
