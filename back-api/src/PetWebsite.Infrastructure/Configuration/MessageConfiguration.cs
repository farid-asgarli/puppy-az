using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Infrastructure.Configuration;

public class MessageConfiguration : IEntityTypeConfiguration<Message>
{
	public void Configure(EntityTypeBuilder<Message> builder)
	{
		builder.ToTable("Messages");

		builder.HasKey(m => m.Id);

		builder.Property(m => m.Content)
			.IsRequired()
			.HasMaxLength(1000);

		builder.Property(m => m.IsRead)
			.HasDefaultValue(false);

		builder.Property(m => m.IsDeletedBySender)
			.HasDefaultValue(false);

		builder.Property(m => m.IsDeletedByRecipient)
			.HasDefaultValue(false);

		// Indexes
		builder.HasIndex(m => m.ConversationId);
		builder.HasIndex(m => m.SenderId);
		builder.HasIndex(m => m.CreatedAt);

		// Relationships
		builder.HasOne(m => m.Conversation)
			.WithMany(c => c.Messages)
			.HasForeignKey(m => m.ConversationId)
			.OnDelete(DeleteBehavior.Cascade);

		builder.HasOne(m => m.Sender)
			.WithMany(u => u.SentMessages)
			.HasForeignKey(m => m.SenderId)
			.OnDelete(DeleteBehavior.Restrict);
	}
}
