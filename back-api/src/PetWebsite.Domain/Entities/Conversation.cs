using PetWebsite.Domain.Common;

namespace PetWebsite.Domain.Entities;

/// <summary>
/// Represents a conversation between two users about a pet advertisement.
/// </summary>
public class Conversation : AuditableEntity<int>
{
	/// <summary>
	/// The ID of the pet advertisement this conversation is about.
	/// </summary>
	public int PetAdId { get; set; }

	/// <summary>
	/// The ID of the user who initiated the conversation (buyer/interested party).
	/// </summary>
	public Guid InitiatorId { get; set; }

	/// <summary>
	/// The ID of the pet ad owner (seller).
	/// </summary>
	public Guid OwnerId { get; set; }

	/// <summary>
	/// The last message content for preview.
	/// </summary>
	public string LastMessageContent { get; set; } = string.Empty;

	/// <summary>
	/// The date and time of the last message.
	/// </summary>
	public DateTime LastMessageAt { get; set; }

	/// <summary>
	/// Number of unread messages for the initiator.
	/// </summary>
	public int InitiatorUnreadCount { get; set; }

	/// <summary>
	/// Number of unread messages for the owner.
	/// </summary>
	public int OwnerUnreadCount { get; set; }

	/// <summary>
	/// Indicates whether the conversation is archived by the initiator.
	/// </summary>
	public bool IsArchivedByInitiator { get; set; }

	/// <summary>
	/// Indicates whether the conversation is archived by the owner.
	/// </summary>
	public bool IsArchivedByOwner { get; set; }

	// Navigation properties
	public virtual PetAd PetAd { get; set; } = null!;
	public virtual User Initiator { get; set; } = null!;
	public virtual User Owner { get; set; } = null!;
	public virtual ICollection<Message> Messages { get; set; } = new List<Message>();
}
