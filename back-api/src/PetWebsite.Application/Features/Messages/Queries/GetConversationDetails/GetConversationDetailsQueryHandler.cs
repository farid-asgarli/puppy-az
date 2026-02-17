using MediatR;
using Microsoft.EntityFrameworkCore;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Features.Messages.Queries.Dtos;

namespace PetWebsite.Application.Features.Messages.Queries.GetConversationDetails;

public class GetConversationDetailsQueryHandler : IRequestHandler<GetConversationDetailsQuery, ConversationDetailsDto>
{
    private readonly IApplicationDbContext _context;

    public GetConversationDetailsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ConversationDetailsDto> Handle(GetConversationDetailsQuery request, CancellationToken cancellationToken)
    {
        var conversation = await _context.Conversations
            .Include(c => c.PetAd)
            .Include(c => c.Initiator)
            .Include(c => c.Owner)
            .Include(c => c.Messages)
            .FirstOrDefaultAsync(c => c.Id == request.ConversationId, cancellationToken);

        if (conversation == null)
            return null!;

        // Check if user is part of this conversation
        if (conversation.InitiatorId != request.UserId && conversation.OwnerId != request.UserId)
            return null!;

        var messages = conversation.Messages
            .Where(m => !m.IsDeletedBySender) // Filter deleted messages
            .OrderBy(m => m.CreatedAt)
            .Select(m => new MessageDto
            {
                Id = m.Id,
                ConversationId = m.ConversationId,
                SenderId = m.SenderId,
                Content = m.Content,
                IsRead = m.IsRead,
                CreatedAt = m.CreatedAt,
                UpdatedAt = m.UpdatedAt,
                IsDeletedBySender = m.IsDeletedBySender
            })
            .ToList();

        var result = new ConversationDetailsDto
        {
            Id = conversation.Id,
            PetAdId = conversation.PetAdId,
            PetAdTitle = conversation.PetAd.Title,
            PetAdImageUrl = conversation.PetAd.Images.OrderByDescending(i => i.IsPrimary).ThenBy(i => i.UploadedAt).Select(i => i.FilePath).FirstOrDefault(),
            OtherPartyId = conversation.InitiatorId == request.UserId ? conversation.OwnerId : conversation.InitiatorId,
            OtherPartyName = conversation.InitiatorId == request.UserId 
                ? (conversation.Owner.FirstName ?? "") + (string.IsNullOrEmpty(conversation.Owner.LastName) ? "" : " " + conversation.Owner.LastName)
                : (conversation.Initiator.FirstName ?? "") + (string.IsNullOrEmpty(conversation.Initiator.LastName) ? "" : " " + conversation.Initiator.LastName),
            OtherPartyAvatar = conversation.InitiatorId == request.UserId 
                ? conversation.Owner.ProfilePictureUrl 
                : conversation.Initiator.ProfilePictureUrl,
            Messages = messages
        };

        // Mark messages as read
        var unreadMessages = conversation.Messages
            .Where(m => m.SenderId != request.UserId && !m.IsRead)
            .ToList();

        foreach (var message in unreadMessages)
        {
            message.IsRead = true;
        }

        // Reset unread count
        if (conversation.InitiatorId == request.UserId)
            conversation.InitiatorUnreadCount = 0;
        else
            conversation.OwnerUnreadCount = 0;

        if (unreadMessages.Any())
        {
            await _context.SaveChangesAsync(cancellationToken);
        }

        return result;
    }
}
