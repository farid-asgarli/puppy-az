using PetWebsite.Domain.Common;

namespace PetWebsite.Domain.Entities;

/// <summary>
/// Represents a message in a conversation.
/// </summary>
public class Message : AuditableEntity<int>
{
	/// <summary>
	/// The ID of the conversation this message belongs to.
	/// </summary>
	public int ConversationId { get; set; }

	/// <summary>
	/// The ID of the user who sent the message.
	/// </summary>
	public Guid SenderId { get; set; }

	/// <summary>
	/// The message content.
	/// </summary>
	public string Content { get; set; } = null!;

	/// <summary>
	/// Indicates whether the message has been read by the recipient.
	/// </summary>
	public bool IsRead { get; set; }

	/// <summary>
	/// The date and time when the message was read.
	/// </summary>
	public DateTime? ReadAt { get; set; }

	/// <summary>
	/// Indicates whether the message has been deleted by the sender.
	/// </summary>
	public bool IsDeletedBySender { get; set; }

	/// <summary>
	/// Indicates whether the message has been deleted by the recipient.
	/// </summary>
	public bool IsDeletedByRecipient { get; set; }

	// Navigation properties
	public virtual Conversation Conversation { get; set; } = null!;
	public virtual User Sender { get; set; } = null!;
}
