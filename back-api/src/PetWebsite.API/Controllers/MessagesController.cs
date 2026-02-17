using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetWebsite.Application.Features.Messages.Commands.DeleteMessage;
using PetWebsite.Application.Features.Messages.Commands.SendMessage;
using PetWebsite.Application.Features.Messages.Commands.UpdateMessage;
using PetWebsite.Application.Features.Messages.Queries.GetConversationDetails;
using PetWebsite.Application.Features.Messages.Queries.GetConversations;
using PetWebsite.Application.Features.Messages.Queries.GetUnreadCount;

namespace PetWebsite.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class MessagesController : ControllerBase
{
    private readonly IMediator _mediator;

    public MessagesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Get all conversations for the current user
    /// </summary>
    [HttpGet("conversations")]
    public async Task<IActionResult> GetConversations()
    {
        var userIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdStr) || !Guid.TryParse(userIdStr, out var userId))
            return Unauthorized();
            
        var conversations = await _mediator.Send(new GetConversationsQuery(userId));
        return Ok(conversations);
    }

    /// <summary>
    /// Get conversation details with messages
    /// </summary>
    [HttpGet("conversations/{conversationId}")]
    public async Task<IActionResult> GetConversationDetails(int conversationId)
    {
        var userIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdStr) || !Guid.TryParse(userIdStr, out var userId))
            return Unauthorized();
            
        var conversation = await _mediator.Send(new GetConversationDetailsQuery(conversationId, userId));
        return Ok(conversation);
    }

    /// <summary>
    /// Send a message (creates conversation if it doesn't exist)
    /// </summary>
    [HttpPost("send")]
    public async Task<IActionResult> SendMessage([FromBody] SendMessageCommand command)
    {
        var userIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdStr) || !Guid.TryParse(userIdStr, out var userId))
            return Unauthorized();
            
        // Note: SendMessageCommand already has SenderId from client, backend validates it
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    /// <summary>
    /// Get unread message count
    /// </summary>
    [HttpGet("unread-count")]
    public async Task<IActionResult> GetUnreadCount()
    {
        var userIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdStr) || !Guid.TryParse(userIdStr, out var userId))
            return Unauthorized();
            
        var count = await _mediator.Send(new GetUnreadMessageCountQuery(userId));
        return Ok(new { unreadCount = count });
    }

    /// <summary>
    /// Update a message
    /// </summary>
    [HttpPut("{messageId}")]
    public async Task<IActionResult> UpdateMessage(int messageId, [FromBody] UpdateMessageRequest request)
    {
        var result = await _mediator.Send(new UpdateMessageCommand
        {
            MessageId = messageId,
            Content = request.Content
        });
        return Ok(result);
    }

    /// <summary>
    /// Delete a message
    /// </summary>
    [HttpDelete("{messageId}")]
    public async Task<IActionResult> DeleteMessage(int messageId)
    {
        var result = await _mediator.Send(new DeleteMessageCommand { MessageId = messageId });
        return Ok(result);
    }
}

public record UpdateMessageRequest(string Content);
