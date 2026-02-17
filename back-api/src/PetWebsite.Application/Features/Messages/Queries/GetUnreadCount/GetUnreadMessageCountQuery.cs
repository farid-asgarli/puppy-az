using MediatR;

namespace PetWebsite.Application.Features.Messages.Queries.GetUnreadCount;

public record GetUnreadMessageCountQuery(Guid UserId) : IRequest<int>;
