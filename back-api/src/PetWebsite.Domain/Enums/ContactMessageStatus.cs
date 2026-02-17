namespace PetWebsite.Domain.Enums;

/// <summary>
/// Status of a contact message.
/// </summary>
public enum ContactMessageStatus
{
	/// <summary>
	/// New unread message.
	/// </summary>
	New = 0,

	/// <summary>
	/// Message has been read by admin.
	/// </summary>
	Read = 1,

	/// <summary>
	/// Message has been replied to.
	/// </summary>
	Replied = 2
}
