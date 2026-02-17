using PetWebsite.Domain.Enums;

namespace PetWebsite.Application.Features.ContactMessages;

/// <summary>
/// Summary DTO for contact message list view.
/// </summary>
public class ContactMessageListItemDto
{
	public int Id { get; set; }
	public string? SenderName { get; set; }
	public string? SenderEmail { get; set; }
	public string? SenderPhone { get; set; }
	public Guid? UserId { get; set; }
	public string? Subject { get; set; }
	public string MessagePreview { get; set; } = null!;
	public ContactMessageType MessageType { get; set; }
	public ContactMessageStatus Status { get; set; }
	public string LanguageCode { get; set; } = null!;
	public bool IsSpam { get; set; }
	public bool IsStarred { get; set; }
	public bool IsArchived { get; set; }
	public bool HasReply { get; set; }
	public DateTime CreatedAt { get; set; }
}

/// <summary>
/// Detailed DTO for viewing a single contact message.
/// </summary>
public class ContactMessageDetailDto
{
	public int Id { get; set; }
	public string? SenderName { get; set; }
	public string? SenderEmail { get; set; }
	public string? SenderPhone { get; set; }
	public Guid? UserId { get; set; }
	public UserBriefDto? User { get; set; }
	/// <summary>
	/// User matched by phone number (if sender was not logged in but phone matches a registered user).
	/// </summary>
	public UserBriefDto? MatchedUserByPhone { get; set; }
	public string? Subject { get; set; }
	public string Message { get; set; } = null!;
	public ContactMessageType MessageType { get; set; }
	public ContactMessageStatus Status { get; set; }
	public string LanguageCode { get; set; } = null!;
	public string? AdminReply { get; set; }
	public DateTime? ReadAt { get; set; }
	public Guid? ReadByAdminId { get; set; }
	public string? ReadByAdminName { get; set; }
	public DateTime? RepliedAt { get; set; }
	public Guid? RepliedByAdminId { get; set; }
	public string? RepliedByAdminName { get; set; }
	public string? IpAddress { get; set; }
	public string? UserAgent { get; set; }
	public string? SourceUrl { get; set; }
	public string? InternalNotes { get; set; }
	public bool IsSpam { get; set; }
	public bool IsStarred { get; set; }
	public bool IsArchived { get; set; }
	public DateTime CreatedAt { get; set; }
	public DateTime? UpdatedAt { get; set; }
}

/// <summary>
/// Brief user info for contact message.
/// </summary>
public class UserBriefDto
{
	public Guid Id { get; set; }
	public string? FullName { get; set; }
	public string? PhoneNumber { get; set; }
	public string? Email { get; set; }
	public string? ProfilePictureUrl { get; set; }
	public DateTime? CreatedAt { get; set; }
	public bool IsVerified { get; set; }
	public int TotalAdsCount { get; set; }
}

/// <summary>
/// DTO for creating a contact message (from public form).
/// </summary>
public class CreateContactMessageDto
{
	public string? SenderName { get; set; }
	public string? SenderEmail { get; set; }
	public string? SenderPhone { get; set; }
	public string? Subject { get; set; }
	public string Message { get; set; } = null!;
	public ContactMessageType MessageType { get; set; } = ContactMessageType.General;
	public string LanguageCode { get; set; } = "az";
}

/// <summary>
/// DTO for replying to a contact message.
/// </summary>
public class ReplyContactMessageDto
{
	public string Reply { get; set; } = null!;
}

/// <summary>
/// DTO for updating contact message status/flags.
/// </summary>
public class UpdateContactMessageDto
{
	public ContactMessageStatus? Status { get; set; }
	public bool? IsSpam { get; set; }
	public bool? IsStarred { get; set; }
	public bool? IsArchived { get; set; }
	public string? InternalNotes { get; set; }
}

/// <summary>
/// Statistics for contact messages.
/// </summary>
public class ContactMessageStatsDto
{
	public int TotalCount { get; set; }
	public int NewCount { get; set; }
	public int ReadCount { get; set; }
	public int RepliedCount { get; set; }
	public int SpamCount { get; set; }
	public int StarredCount { get; set; }
	public int ArchivedCount { get; set; }
	public Dictionary<ContactMessageType, int> ByType { get; set; } = new();
}
