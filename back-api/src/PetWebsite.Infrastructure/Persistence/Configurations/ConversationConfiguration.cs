using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Infrastructure.Persistence.Configurations;

/// <summary>
/// Entity type configuration for Conversation.
/// </summary>
public class ConversationConfiguration : IEntityTypeConfiguration<Conversation>
{
	public void Configure(EntityTypeBuilder<Conversation> builder)
	{
		builder.HasKey(e => e.Id);

		builder.Property(e => e.PetAdId).IsRequired();

		builder.Property(e => e.InitiatorId).IsRequired();

		builder.Property(e => e.OwnerId).IsRequired();

		builder.Property(e => e.LastMessageContent)
			.IsRequired()
			.HasMaxLength(500);

		builder.Property(e => e.LastMessageAt).IsRequired();

		builder.Property(e => e.InitiatorUnreadCount)
			.IsRequired()
			.HasDefaultValue(0);

		builder.Property(e => e.OwnerUnreadCount)
			.IsRequired()
			.HasDefaultValue(0);

		builder.Property(e => e.IsArchivedByInitiator)
			.IsRequired()
			.HasDefaultValue(false);

		builder.Property(e => e.IsArchivedByOwner)
			.IsRequired()
			.HasDefaultValue(false);

		// Relationships
		builder.HasOne(e => e.PetAd)
			.WithMany()
			.HasForeignKey(e => e.PetAdId)
			.OnDelete(DeleteBehavior.Restrict);

		builder.HasOne(e => e.Initiator)
			.WithMany(u => u.InitiatedConversations)
			.HasForeignKey(e => e.InitiatorId)
			.OnDelete(DeleteBehavior.Restrict);

		builder.HasOne(e => e.Owner)
			.WithMany(u => u.ReceivedConversations)
			.HasForeignKey(e => e.OwnerId)
			.OnDelete(DeleteBehavior.Restrict);

		builder.HasMany(e => e.Messages)
			.WithOne(m => m.Conversation)
			.HasForeignKey(m => m.ConversationId)
			.OnDelete(DeleteBehavior.Cascade);

		// Indexes for performance
		builder.HasIndex(e => e.PetAdId);
		builder.HasIndex(e => e.InitiatorId);
		builder.HasIndex(e => e.OwnerId);
		builder.HasIndex(e => e.LastMessageAt);
		
		// Composite index for finding conversation between two users for a specific ad
		builder.HasIndex(e => new { e.PetAdId, e.InitiatorId, e.OwnerId })
			.IsUnique();
	}
}
