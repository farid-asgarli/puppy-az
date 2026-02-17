using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Constants;

namespace PetWebsite.Application.Features.Messages.Commands.UpdateMessage;

public class UpdateMessageCommandHandler(
    IApplicationDbContext dbContext,
    ICurrentUserService currentUserService,
    IStringLocalizer localizer)
    : BaseHandler(localizer),
        ICommandHandler<UpdateMessageCommand, Result>
{
    public async Task<Result> Handle(UpdateMessageCommand request, CancellationToken ct)
    {
        var userId = currentUserService.UserId;
        if (userId == null)
            return Result.Failure(L(LocalizationKeys.Error.Unauthorized), 401);

        // Find the message
        var message = await dbContext.Messages
            .Include(m => m.Conversation)
            .FirstOrDefaultAsync(m => m.Id == request.MessageId, ct);

        if (message == null)
            return Result.Failure(L(LocalizationKeys.Message.NotFound), 404);

        // Only the sender can edit their own message
        if (message.SenderId != userId.Value)
            return Result.Failure(L(LocalizationKeys.Error.Forbidden), 403);

        // Update the message content
        message.Content = request.Content.Trim();
        message.UpdatedAt = DateTime.UtcNow;

        // Update conversation's last message if this was the last message
        var conversation = message.Conversation;
        var lastMessage = await dbContext.Messages
            .Where(m => m.ConversationId == conversation.Id)
            .OrderByDescending(m => m.CreatedAt)
            .FirstOrDefaultAsync(ct);

        if (lastMessage?.Id == message.Id)
        {
            var messagePreview = request.Content.Length > 500
                ? request.Content[..497] + "..."
                : request.Content;
            conversation.LastMessageContent = messagePreview;
            conversation.UpdatedAt = DateTime.UtcNow;
        }

        await dbContext.SaveChangesAsync(ct);

        return Result.Success();
    }
}
