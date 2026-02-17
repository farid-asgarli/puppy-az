using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Domain.Enums;

namespace PetWebsite.Application.Features.ContactMessages.Commands;

/// <summary>
/// Command for creating a contact message (from public form).
/// </summary>
public class CreateContactMessageCommand : ICommand<int>
{
	public string? SenderName { get; set; }
	public string? SenderEmail { get; set; }
	public string? SenderPhone { get; set; }
	public Guid? UserId { get; set; }
	public string? Subject { get; set; }
	public string Message { get; set; } = null!;
	public ContactMessageType MessageType { get; set; } = ContactMessageType.General;
	public string LanguageCode { get; set; } = "az";
	public string? IpAddress { get; set; }
	public string? UserAgent { get; set; }
	public string? SourceUrl { get; set; }
}
