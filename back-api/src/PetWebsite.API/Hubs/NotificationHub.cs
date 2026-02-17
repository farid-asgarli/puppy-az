using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace PetWebsite.API.Hubs;

/// <summary>
/// SignalR Hub for real-time notifications (messages, questions, etc.)
/// </summary>
[Authorize]
public class NotificationHub : Hub
{
	private static readonly Dictionary<string, HashSet<string>> _userConnections = new();
	private static readonly object _lock = new();

	public override async Task OnConnectedAsync()
	{
		var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
		
		if (!string.IsNullOrEmpty(userId))
		{
			lock (_lock)
			{
				if (!_userConnections.ContainsKey(userId))
				{
					_userConnections[userId] = new HashSet<string>();
				}
				_userConnections[userId].Add(Context.ConnectionId);
			}

			// Add user to their personal group for targeted notifications
			await Groups.AddToGroupAsync(Context.ConnectionId, $"user_{userId}");
			
			Console.WriteLine($"[SignalR] User {userId} connected with connection {Context.ConnectionId}");
		}

		await base.OnConnectedAsync();
	}

	public override async Task OnDisconnectedAsync(Exception? exception)
	{
		var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
		
		if (!string.IsNullOrEmpty(userId))
		{
			lock (_lock)
			{
				if (_userConnections.ContainsKey(userId))
				{
					_userConnections[userId].Remove(Context.ConnectionId);
					if (_userConnections[userId].Count == 0)
					{
						_userConnections.Remove(userId);
					}
				}
			}

			await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"user_{userId}");
			
			Console.WriteLine($"[SignalR] User {userId} disconnected (connection {Context.ConnectionId})");
		}

		await base.OnDisconnectedAsync(exception);
	}

	/// <summary>
	/// Join a conversation group to receive real-time messages
	/// </summary>
	public async Task JoinConversation(int conversationId)
	{
		var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
		if (string.IsNullOrEmpty(userId)) return;

		await Groups.AddToGroupAsync(Context.ConnectionId, $"conversation_{conversationId}");
		Console.WriteLine($"[SignalR] User {userId} joined conversation {conversationId}");
	}

	/// <summary>
	/// Leave a conversation group
	/// </summary>
	public async Task LeaveConversation(int conversationId)
	{
		var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
		if (string.IsNullOrEmpty(userId)) return;

		await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"conversation_{conversationId}");
		Console.WriteLine($"[SignalR] User {userId} left conversation {conversationId}");
	}

	/// <summary>
	/// Join a pet ad group to receive real-time question updates
	/// </summary>
	public async Task JoinPetAdQuestions(int petAdId)
	{
		await Groups.AddToGroupAsync(Context.ConnectionId, $"petad_{petAdId}");
		Console.WriteLine($"[SignalR] Connection {Context.ConnectionId} joined pet ad {petAdId} questions");
	}

	/// <summary>
	/// Leave a pet ad group
	/// </summary>
	public async Task LeavePetAdQuestions(int petAdId)
	{
		await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"petad_{petAdId}");
		Console.WriteLine($"[SignalR] Connection {Context.ConnectionId} left pet ad {petAdId} questions");
	}

	/// <summary>
	/// Check if a user is currently connected
	/// </summary>
	public static bool IsUserConnected(string userId)
	{
		lock (_lock)
		{
			return _userConnections.ContainsKey(userId) && _userConnections[userId].Count > 0;
		}
	}

	/// <summary>
	/// Get all connection IDs for a user
	/// </summary>
	public static IEnumerable<string> GetUserConnections(string userId)
	{
		lock (_lock)
		{
			if (_userConnections.TryGetValue(userId, out var connections))
			{
				return connections.ToList();
			}
			return Enumerable.Empty<string>();
		}
	}
}
