using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Infrastructure.Persistence.Configurations;

/// <summary>
/// Entity type configuration for Message.
/// </summary>
public class MessageConfiguration : IEntityTypeConfiguration<Message>
{
	public void Configure(EntityTypeBuilder<Message> builder)
	{
		builder.HasKey(e => e.Id);

		builder.Property(e => e.ConversationId).IsRequired();

		builder.Property(e => e.SenderId).IsRequired();

		builder.Property(e => e.Content)
			.IsRequired()
			.HasMaxLength(2000);

		builder.Property(e => e.IsRead)
			.IsRequired()
			.HasDefaultValue(false);

		builder.Property(e => e.ReadAt);

		builder.Property(e => e.IsDeletedBySender)
			.IsRequired()
			.HasDefaultValue(false);

		builder.Property(e => e.IsDeletedByRecipient)
			.IsRequired()
			.HasDefaultValue(false);

		// Relationships
		builder.HasOne(e => e.Conversation)
			.WithMany(c => c.Messages)
			.HasForeignKey(e => e.ConversationId)
			.OnDelete(DeleteBehavior.Cascade);

		builder.HasOne(e => e.Sender)
			.WithMany(u => u.SentMessages)
			.HasForeignKey(e => e.SenderId)
			.OnDelete(DeleteBehavior.Restrict);

		// Indexes for performance
		builder.HasIndex(e => e.ConversationId);
		builder.HasIndex(e => e.SenderId);
		builder.HasIndex(e => e.CreatedAt);
	}
}
