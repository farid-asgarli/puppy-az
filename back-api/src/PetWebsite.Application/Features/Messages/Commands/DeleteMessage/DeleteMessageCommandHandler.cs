using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Constants;

namespace PetWebsite.Application.Features.Messages.Commands.DeleteMessage;

public class DeleteMessageCommandHandler(
    IApplicationDbContext dbContext,
    ICurrentUserService currentUserService,
    IStringLocalizer localizer)
    : BaseHandler(localizer),
        ICommandHandler<DeleteMessageCommand, Result>
{
    public async Task<Result> Handle(DeleteMessageCommand request, CancellationToken ct)
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

        // Only the sender can delete their own message
        if (message.SenderId != userId.Value)
            return Result.Failure(L(LocalizationKeys.Error.Forbidden), 403);

        var conversation = message.Conversation;
        var now = DateTime.UtcNow;

        // Soft delete - mark as deleted
        message.IsDeletedBySender = true;
        message.UpdatedAt = now;

        // Update conversation's last message if needed
        var lastVisibleMessage = await dbContext.Messages
            .Where(m => m.ConversationId == conversation.Id && !m.IsDeletedBySender)
            .OrderByDescending(m => m.CreatedAt)
            .FirstOrDefaultAsync(ct);

        if (lastVisibleMessage != null)
        {
            var messagePreview = lastVisibleMessage.Content.Length > 500
                ? lastVisibleMessage.Content[..497] + "..."
                : lastVisibleMessage.Content;
            conversation.LastMessageContent = messagePreview;
            conversation.LastMessageAt = lastVisibleMessage.CreatedAt;
        }
        else
        {
            conversation.LastMessageContent = "";
        }

        conversation.UpdatedAt = now;

        await dbContext.SaveChangesAsync(ct);

        return Result.Success();
    }
}
