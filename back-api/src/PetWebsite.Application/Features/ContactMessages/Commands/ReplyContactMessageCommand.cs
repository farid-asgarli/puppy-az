using PetWebsite.Application.Common.Interfaces;

namespace PetWebsite.Application.Features.ContactMessages.Commands;

/// <summary>
/// Command for replying to a contact message.
/// </summary>
public class ReplyContactMessageCommand : ICommand<bool>
{
	public int Id { get; set; }
	public string Reply { get; set; } = null!;
}
