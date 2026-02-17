using PetWebsite.Domain.Common;
using PetWebsite.Domain.Enums;

namespace PetWebsite.Domain.Entities;

/// <summary>
/// Represents a contact message sent from users via contact forms on the website.
/// </summary>
public class ContactMessage : AuditableEntity
{
	/// <summary>
	/// Gets or sets the name of the sender (for anonymous users).
	/// </summary>
	public string? SenderName { get; set; }

	/// <summary>
	/// Gets or sets the email of the sender.
	/// </summary>
	public string? SenderEmail { get; set; }

	/// <summary>
	/// Gets or sets the phone number of the sender.
	/// </summary>
	public string? SenderPhone { get; set; }

	/// <summary>
	/// Gets or sets the ID of the authenticated user who sent the message (if logged in).
	/// </summary>
	public Guid? UserId { get; set; }

	/// <summary>
	/// Gets or sets the subject/title of the message.
	/// </summary>
	public string? Subject { get; set; }

	/// <summary>
	/// Gets or sets the main message content.
	/// </summary>
	public string Message { get; set; } = null!;

	/// <summary>
	/// Gets or sets the type/category of the message.
	/// </summary>
	public ContactMessageType MessageType { get; set; } = ContactMessageType.General;

	/// <summary>
	/// Gets or sets the status of the message.
	/// </summary>
	public ContactMessageStatus Status { get; set; } = ContactMessageStatus.New;

	/// <summary>
	/// Gets or sets the language/locale code of the message (e.g., "az", "en", "ru").
	/// </summary>
	public string LanguageCode { get; set; } = "az";

	/// <summary>
	/// Gets or sets the admin's reply to the message.
	/// </summary>
	public string? AdminReply { get; set; }

	/// <summary>
	/// Gets or sets when the message was read by admin.
	/// </summary>
	public DateTime? ReadAt { get; set; }

	/// <summary>
	/// Gets or sets the admin user ID who read the message.
	/// </summary>
	public Guid? ReadByAdminId { get; set; }

	/// <summary>
	/// Gets or sets when the reply was sent.
	/// </summary>
	public DateTime? RepliedAt { get; set; }

	/// <summary>
	/// Gets or sets the admin user ID who replied.
	/// </summary>
	public Guid? RepliedByAdminId { get; set; }

	/// <summary>
	/// Gets or sets the IP address of the sender.
	/// </summary>
	public string? IpAddress { get; set; }

	/// <summary>
	/// Gets or sets the user agent of the sender's browser.
	/// </summary>
	public string? UserAgent { get; set; }

	/// <summary>
	/// Gets or sets the page URL from where the message was sent.
	/// </summary>
	public string? SourceUrl { get; set; }

	/// <summary>
	/// Gets or sets internal notes about this message (for admins only).
	/// </summary>
	public string? InternalNotes { get; set; }

	/// <summary>
	/// Gets or sets whether this message is marked as spam.
	/// </summary>
	public bool IsSpam { get; set; }

	/// <summary>
	/// Gets or sets whether this message is starred/important.
	/// </summary>
	public bool IsStarred { get; set; }

	/// <summary>
	/// Gets or sets whether this message is archived.
	/// </summary>
	public bool IsArchived { get; set; }

	// Navigation properties

	/// <summary>
	/// Navigation property for the user who sent the message.
	/// </summary>
	public virtual User? User { get; set; }
}
