using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Application.Extensions;
using PetWebsite.Domain.Constants;
using PetWebsite.Domain.Entities;
using PetWebsite.Domain.Enums;

namespace PetWebsite.Application.Features.Messages.Commands.SendMessage;

public class SendMessageCommandHandler(
	IApplicationDbContext dbContext,
	ICurrentUserService currentUserService,
	IStringLocalizer localizer)
	: BaseHandler(localizer),
		ICommandHandler<SendMessageCommand, Result<SendMessageResponse>>
{
	public async Task<Result<SendMessageResponse>> Handle(SendMessageCommand request, CancellationToken ct)
	{
		var userId = currentUserService.UserId;
		if (userId == null)
			return Result<SendMessageResponse>.Failure(L(LocalizationKeys.Error.Unauthorized), 401);

		// Cannot message yourself
		if (userId == request.ReceiverId)
			return Result<SendMessageResponse>.Failure(L(LocalizationKeys.Message.CannotMessageSelf), 400);

		// Check if the pet ad exists and is published
		var petAd = await dbContext.PetAds
			.WhereNotDeleted<PetAd, int>()
			.FirstOrDefaultAsync(p => p.Id == request.PetAdId, ct);

		if (petAd == null)
			return Result<SendMessageResponse>.Failure(L(LocalizationKeys.Message.PetAdNotFound), 404);

		if (petAd.Status != PetAdStatus.Published)
			return Result<SendMessageResponse>.Failure(L(LocalizationKeys.PetAd.NotPublished), 400);

		// Verify receiver is the pet ad owner
		if (petAd.UserId != request.ReceiverId)
			return Result<SendMessageResponse>.Failure(L(LocalizationKeys.Message.ReceiverNotFound), 404);

		// Check if receiver exists
		var receiver = await dbContext.RegularUsers.FindAsync([request.ReceiverId], ct);
		if (receiver == null)
			return Result<SendMessageResponse>.Failure(L(LocalizationKeys.Message.ReceiverNotFound), 404);

		// Check if a conversation already exists between these users for this ad
		var existingConversation = await dbContext.Conversations
			.FirstOrDefaultAsync(c =>
				c.PetAdId == request.PetAdId &&
				c.InitiatorId == userId.Value &&
				c.OwnerId == request.ReceiverId, ct);

		int conversationId;
		var now = DateTime.UtcNow;
		var messagePreview = request.Content.Length > 500
			? request.Content[..497] + "..."
			: request.Content;

		if (existingConversation != null)
		{
			// Add message to existing conversation
			conversationId = existingConversation.Id;

			var message = new Message
			{
				ConversationId = conversationId,
				SenderId = userId.Value,
				Content = request.Content.Trim(),
				CreatedAt = now,
			};

			dbContext.Messages.Add(message);

			// Update conversation
			existingConversation.LastMessageContent = messagePreview;
			existingConversation.LastMessageAt = now;
			existingConversation.OwnerUnreadCount++;
			existingConversation.UpdatedAt = now;
		}
		else
		{
			// Create new conversation
			var conversation = new Conversation
			{
				PetAdId = request.PetAdId,
				InitiatorId = userId.Value,
				OwnerId = request.ReceiverId,
				LastMessageContent = messagePreview,
				LastMessageAt = now,
				OwnerUnreadCount = 1,
				CreatedAt = now,
			};

			dbContext.Conversations.Add(conversation);
			await dbContext.SaveChangesAsync(ct);

			conversationId = conversation.Id;

			// Add the message
			var message = new Message
			{
				ConversationId = conversationId,
				SenderId = userId.Value,
				Content = request.Content.Trim(),
				CreatedAt = now,
			};

			dbContext.Messages.Add(message);
		}

		await dbContext.SaveChangesAsync(ct);

		return Result<SendMessageResponse>.Success(new SendMessageResponse
		{
			ConversationId = conversationId
		});
	}
}
