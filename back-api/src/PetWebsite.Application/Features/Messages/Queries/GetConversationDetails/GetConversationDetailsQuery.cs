using MediatR;
using PetWebsite.Application.Features.Messages.Queries.Dtos;

namespace PetWebsite.Application.Features.Messages.Queries.GetConversationDetails;

public record GetConversationDetailsQuery(int ConversationId, Guid UserId) : IRequest<ConversationDetailsDto>;
