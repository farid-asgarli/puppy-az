using Microsoft.AspNetCore.SignalR;
using PetWebsite.API.Hubs;

namespace PetWebsite.API.Services;

/// <summary>
/// Service for sending real-time notifications via SignalR
/// </summary>
public interface INotificationService
{
	/// <summary>
	/// Send a new message notification to a user
	/// </summary>
	Task SendNewMessageAsync(string userId, NewMessageNotification notification);

	/// <summary>
	/// Send a message to all participants in a conversation
	/// </summary>
	Task SendMessageToConversationAsync(int conversationId, ConversationMessageNotification notification);

	/// <summary>
	/// Send a new question notification to the ad owner
	/// </summary>
	Task SendNewQuestionAsync(string ownerId, NewQuestionNotification notification);

	/// <summary>
	/// Send a question answer/reply notification
	/// </summary>
	Task SendQuestionAnsweredAsync(int petAdId, string questionerId, QuestionAnsweredNotification notification);

	/// <summary>
	/// Send a new reply notification to question participants
	/// </summary>
	Task SendNewReplyAsync(int petAdId, string questionerId, NewReplyNotification notification);

	/// <summary>
	/// Send question deleted notification
	/// </summary>
	Task SendQuestionDeletedAsync(int petAdId, QuestionDeletedNotification notification);

	/// <summary>
	/// Send reply deleted notification
	/// </summary>
	Task SendReplyDeletedAsync(int petAdId, ReplyDeletedNotification notification);

	/// <summary>
	/// Send answer deleted notification
	/// </summary>
	Task SendAnswerDeletedAsync(int petAdId, AnswerDeletedNotification notification);

	/// <summary>
	/// Send unread count update to a user
	/// </summary>
	Task SendUnreadCountUpdateAsync(string userId, UnreadCountNotification notification);
}

public class NotificationService(IHubContext<NotificationHub> hubContext) : INotificationService
{
	public async Task SendNewMessageAsync(string userId, NewMessageNotification notification)
	{
		await hubContext.Clients.Group($"user_{userId}").SendAsync("ReceiveNewMessage", notification);
		Console.WriteLine($"[SignalR] Sent ReceiveNewMessage to user {userId}");
	}

	public async Task SendMessageToConversationAsync(int conversationId, ConversationMessageNotification notification)
	{
		await hubContext.Clients.Group($"conversation_{conversationId}").SendAsync("ReceiveConversationMessage", notification);
		Console.WriteLine($"[SignalR] Sent ReceiveConversationMessage to conversation {conversationId}");
	}

	public async Task SendNewQuestionAsync(string ownerId, NewQuestionNotification notification)
	{
		await hubContext.Clients.Group($"user_{ownerId}").SendAsync("ReceiveNewQuestion", notification);
		Console.WriteLine($"[SignalR] Sent ReceiveNewQuestion to owner {ownerId}");
	}

	public async Task SendQuestionAnsweredAsync(int petAdId, string questionerId, QuestionAnsweredNotification notification)
	{
		// Send to pet ad group (for ad details page visitors)
		await hubContext.Clients.Group($"petad_{petAdId}").SendAsync("ReceiveQuestionAnswered", notification);
		
		// Also send to the questioner directly
		await hubContext.Clients.Group($"user_{questionerId}").SendAsync("ReceiveQuestionAnswered", notification);
		
		Console.WriteLine($"[SignalR] Sent ReceiveQuestionAnswered to pet ad {petAdId} and questioner {questionerId}");
	}

	public async Task SendNewReplyAsync(int petAdId, string questionerId, NewReplyNotification notification)
	{
		// Send to pet ad group (for ad details page)
		await hubContext.Clients.Group($"petad_{petAdId}").SendAsync("ReceiveNewReply", notification);
		
		// Also send to the questioner if they're connected
		await hubContext.Clients.Group($"user_{questionerId}").SendAsync("ReceiveNewReply", notification);
		
		Console.WriteLine($"[SignalR] Sent ReceiveNewReply to pet ad {petAdId} and questioner {questionerId}");
	}

	public async Task SendQuestionDeletedAsync(int petAdId, QuestionDeletedNotification notification)
	{
		// Send to pet ad group (for ad details page)
		await hubContext.Clients.Group($"petad_{petAdId}").SendAsync("ReceiveQuestionDeleted", notification);
		Console.WriteLine($"[SignalR] Sent ReceiveQuestionDeleted to pet ad {petAdId}");
	}

	public async Task SendReplyDeletedAsync(int petAdId, ReplyDeletedNotification notification)
	{
		// Send to pet ad group (for ad details page)
		await hubContext.Clients.Group($"petad_{petAdId}").SendAsync("ReceiveReplyDeleted", notification);
		Console.WriteLine($"[SignalR] Sent ReceiveReplyDeleted to pet ad {petAdId}");
	}

	public async Task SendAnswerDeletedAsync(int petAdId, AnswerDeletedNotification notification)
	{
		// Send to pet ad group (for ad details page)
		await hubContext.Clients.Group($"petad_{petAdId}").SendAsync("ReceiveAnswerDeleted", notification);
		Console.WriteLine($"[SignalR] Sent ReceiveAnswerDeleted to pet ad {petAdId}");
	}

	public async Task SendUnreadCountUpdateAsync(string userId, UnreadCountNotification notification)
	{
		await hubContext.Clients.Group($"user_{userId}").SendAsync("ReceiveUnreadCountUpdate", notification);
		Console.WriteLine($"[SignalR] Sent ReceiveUnreadCountUpdate to user {userId}");
	}
}

#region Notification DTOs

public record NewMessageNotification
{
	public int ConversationId { get; init; }
	public int MessageId { get; init; }
	public string SenderName { get; init; } = null!;
	public string Content { get; init; } = null!;
	public DateTime SentAt { get; init; }
	public int UnreadCount { get; init; }
}

public record ConversationMessageNotification
{
	public int ConversationId { get; init; }
	public int MessageId { get; init; }
	public string SenderId { get; init; } = null!;
	public string SenderName { get; init; } = null!;
	public string Content { get; init; } = null!;
	public DateTime SentAt { get; init; }
}

public record NewQuestionNotification
{
	public int QuestionId { get; init; }
	public int PetAdId { get; init; }
	public string PetAdTitle { get; init; } = null!;
	public string QuestionText { get; init; } = null!;
	public string QuestionerName { get; init; } = null!;
	public DateTime AskedAt { get; init; }
	public int UnansweredCount { get; init; }
}

public record QuestionAnsweredNotification
{
	public int QuestionId { get; init; }
	public int PetAdId { get; init; }
	public string Answer { get; init; } = null!;
	public DateTime AnsweredAt { get; init; }
}

public record NewReplyNotification
{
	public int QuestionId { get; init; }
	public int PetAdId { get; init; }
	public int ReplyId { get; init; }
	public string ReplyText { get; init; } = null!;
	public string ReplierName { get; init; } = null!;
	public bool IsOwnerReply { get; init; }
	public DateTime CreatedAt { get; init; }
}

public record QuestionDeletedNotification
{
	public int QuestionId { get; init; }
	public int PetAdId { get; init; }
}

public record ReplyDeletedNotification
{
	public int QuestionId { get; init; }
	public int ReplyId { get; init; }
	public int PetAdId { get; init; }
}

public record AnswerDeletedNotification
{
	public int QuestionId { get; init; }
	public int PetAdId { get; init; }
}

public record UnreadCountNotification
{
	public int UnreadMessages { get; init; }
	public int UnansweredQuestions { get; init; }
}

#endregion
