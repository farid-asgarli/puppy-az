using MediatR;
using PetWebsite.Application.Features.Messages.Queries.Dtos;

namespace PetWebsite.Application.Features.Messages.Queries.GetConversations;

public record GetConversationsQuery(Guid UserId) : IRequest<List<ConversationDto>>;
