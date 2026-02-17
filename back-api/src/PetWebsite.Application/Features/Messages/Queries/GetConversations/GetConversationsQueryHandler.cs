using MediatR;
using Microsoft.EntityFrameworkCore;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Features.Messages.Queries.Dtos;

namespace PetWebsite.Application.Features.Messages.Queries.GetConversations;

public class GetConversationsQueryHandler : IRequestHandler<GetConversationsQuery, List<ConversationDto>>
{
    private readonly IApplicationDbContext _context;

    public GetConversationsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<ConversationDto>> Handle(GetConversationsQuery request, CancellationToken cancellationToken)
    {
        var conversations = await _context.Conversations
            .Include(c => c.PetAd)
            .Include(c => c.Initiator)
            .Include(c => c.Owner)
            .Where(c => c.InitiatorId == request.UserId || c.OwnerId == request.UserId)
            .OrderByDescending(c => c.LastMessageAt)
            .Select(c => new ConversationDto
            {
                Id = c.Id,
                PetAdId = c.PetAdId,
                PetAdTitle = c.PetAd.Title,
                PetAdImageUrl = c.PetAd.Images.OrderByDescending(i => i.IsPrimary).ThenBy(i => i.UploadedAt).Select(i => i.FilePath).FirstOrDefault(),
                OtherPartyId = c.InitiatorId == request.UserId ? c.OwnerId : c.InitiatorId,
                OtherPartyName = c.InitiatorId == request.UserId 
                    ? (c.Owner.FirstName ?? "") + (string.IsNullOrEmpty(c.Owner.LastName) ? "" : " " + c.Owner.LastName)
                    : (c.Initiator.FirstName ?? "") + (string.IsNullOrEmpty(c.Initiator.LastName) ? "" : " " + c.Initiator.LastName),
                OtherPartyAvatar = c.InitiatorId == request.UserId ? c.Owner.ProfilePictureUrl : c.Initiator.ProfilePictureUrl,
                LastMessageContent = c.LastMessageContent,
                LastMessageAt = c.LastMessageAt,
                UnreadCount = c.InitiatorId == request.UserId ? c.InitiatorUnreadCount : c.OwnerUnreadCount,
                IsArchived = c.InitiatorId == request.UserId ? c.IsArchivedByInitiator : c.IsArchivedByOwner
            })
            .ToListAsync(cancellationToken);

        return conversations;
    }
}
