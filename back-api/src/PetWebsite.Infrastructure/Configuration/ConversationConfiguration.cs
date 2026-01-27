using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Infrastructure.Configuration;

public class ConversationConfiguration : IEntityTypeConfiguration<Conversation>
{
	public void Configure(EntityTypeBuilder<Conversation> builder)
	{
		builder.ToTable("Conversations");

		builder.HasKey(c => c.Id);

		builder.Property(c => c.LastMessageContent)
			.IsRequired()
			.HasMaxLength(500);

		builder.Property(c => c.LastMessageAt)
			.IsRequired();

		builder.Property(c => c.InitiatorUnreadCount)
			.HasDefaultValue(0);

		builder.Property(c => c.OwnerUnreadCount)
			.HasDefaultValue(0);

		builder.Property(c => c.IsArchivedByInitiator)
			.HasDefaultValue(false);

		builder.Property(c => c.IsArchivedByOwner)
			.HasDefaultValue(false);

		// Indexes
		builder.HasIndex(c => c.PetAdId);
		builder.HasIndex(c => c.InitiatorId);
		builder.HasIndex(c => c.OwnerId);
		builder.HasIndex(c => c.LastMessageAt);
		builder.HasIndex(c => new { c.PetAdId, c.InitiatorId, c.OwnerId }).IsUnique();

		// Relationships
		builder.HasOne(c => c.PetAd)
			.WithMany()
			.HasForeignKey(c => c.PetAdId)
			.OnDelete(DeleteBehavior.Cascade);

		builder.HasOne(c => c.Initiator)
			.WithMany(u => u.InitiatedConversations)
			.HasForeignKey(c => c.InitiatorId)
			.OnDelete(DeleteBehavior.Restrict);

		builder.HasOne(c => c.Owner)
			.WithMany(u => u.ReceivedConversations)
			.HasForeignKey(c => c.OwnerId)
			.OnDelete(DeleteBehavior.Restrict);
	}
}
