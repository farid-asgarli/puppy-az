using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PetWebsite.Domain.Entities;
using PetWebsite.Domain.Enums;

namespace PetWebsite.Infrastructure.Configuration;

public class ContactMessageConfiguration : IEntityTypeConfiguration<ContactMessage>
{
	public void Configure(EntityTypeBuilder<ContactMessage> builder)
	{
		builder.ToTable("ContactMessages");

		builder.HasKey(cm => cm.Id);

		// Sender info
		builder.Property(cm => cm.SenderName)
			.HasMaxLength(200);

		builder.Property(cm => cm.SenderEmail)
			.HasMaxLength(256);

		builder.Property(cm => cm.SenderPhone)
			.HasMaxLength(30);

		builder.Property(cm => cm.Subject)
			.HasMaxLength(500);

		builder.Property(cm => cm.Message)
			.IsRequired()
			.HasMaxLength(5000);

		builder.Property(cm => cm.MessageType)
			.HasConversion<int>()
			.HasDefaultValue(ContactMessageType.General);

		builder.Property(cm => cm.Status)
			.HasConversion<int>()
			.HasDefaultValue(ContactMessageStatus.New);

		builder.Property(cm => cm.LanguageCode)
			.HasMaxLength(10)
			.HasDefaultValue("az");

		builder.Property(cm => cm.AdminReply)
			.HasMaxLength(5000);

		builder.Property(cm => cm.IpAddress)
			.HasMaxLength(50);

		builder.Property(cm => cm.UserAgent)
			.HasMaxLength(500);

		builder.Property(cm => cm.SourceUrl)
			.HasMaxLength(2000);

		builder.Property(cm => cm.InternalNotes)
			.HasMaxLength(2000);

		builder.Property(cm => cm.IsSpam)
			.HasDefaultValue(false);

		builder.Property(cm => cm.IsStarred)
			.HasDefaultValue(false);

		builder.Property(cm => cm.IsArchived)
			.HasDefaultValue(false);

		// Indexes for common queries
		builder.HasIndex(cm => cm.Status);
		builder.HasIndex(cm => cm.MessageType);
		builder.HasIndex(cm => cm.CreatedAt);
		builder.HasIndex(cm => cm.UserId);
		builder.HasIndex(cm => cm.SenderEmail);
		builder.HasIndex(cm => cm.IsSpam);
		builder.HasIndex(cm => cm.IsArchived);
		builder.HasIndex(cm => cm.IsStarred);
		builder.HasIndex(cm => cm.ReadByAdminId);
		builder.HasIndex(cm => cm.RepliedByAdminId);

		// Relationships
		builder.HasOne(cm => cm.User)
			.WithMany()
			.HasForeignKey(cm => cm.UserId)
			.OnDelete(DeleteBehavior.SetNull);
	}
}
