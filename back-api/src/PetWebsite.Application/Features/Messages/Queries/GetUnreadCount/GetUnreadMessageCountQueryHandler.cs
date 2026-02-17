using MediatR;
using Microsoft.EntityFrameworkCore;
using PetWebsite.Application.Common.Interfaces;

namespace PetWebsite.Application.Features.Messages.Queries.GetUnreadCount;

public class GetUnreadMessageCountQueryHandler : IRequestHandler<GetUnreadMessageCountQuery, int>
{
    private readonly IApplicationDbContext _context;

    public GetUnreadMessageCountQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int> Handle(GetUnreadMessageCountQuery request, CancellationToken cancellationToken)
    {
        var totalUnread = await _context.Conversations
            .Where(c => c.InitiatorId == request.UserId || c.OwnerId == request.UserId)
            .SumAsync(c => c.InitiatorId == request.UserId 
                ? c.InitiatorUnreadCount 
                : c.OwnerUnreadCount, 
                cancellationToken);

        return totalUnread;
    }
}
