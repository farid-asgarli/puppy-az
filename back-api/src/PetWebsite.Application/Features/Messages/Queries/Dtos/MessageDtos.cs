namespace PetWebsite.Application.Features.Messages.Queries.Dtos;

public class ConversationDto
{
    public int Id { get; set; }
    public int PetAdId { get; set; }
    public string PetAdTitle { get; set; } = string.Empty;
    public string? PetAdImageUrl { get; set; }
    public Guid OtherPartyId { get; set; }
    public string OtherPartyName { get; set; } = string.Empty;
    public string? OtherPartyAvatar { get; set; }
    public string LastMessageContent { get; set; } = string.Empty;
    public DateTime LastMessageAt { get; set; }
    public int UnreadCount { get; set; }
    public bool IsArchived { get; set; }
}

public class ConversationDetailsDto
{
    public int Id { get; set; }
    public int PetAdId { get; set; }
    public string PetAdTitle { get; set; } = string.Empty;
    public string? PetAdImageUrl { get; set; }
    public Guid OtherPartyId { get; set; }
    public string OtherPartyName { get; set; } = string.Empty;
    public string? OtherPartyAvatar { get; set; }
    public List<MessageDto> Messages { get; set; } = new();
}

public class MessageDto
{
    public int Id { get; set; }
    public int ConversationId { get; set; }
    public Guid SenderId { get; set; }
    public string Content { get; set; } = string.Empty;
    public bool IsRead { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public bool IsDeletedBySender { get; set; }
}
