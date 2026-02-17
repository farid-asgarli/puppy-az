using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Domain.Enums;

namespace PetWebsite.Application.Features.ContactMessages.Commands;

/// <summary>
/// Command for updating contact message flags (spam, starred, archived, notes).
/// </summary>
public class UpdateContactMessageCommand : ICommand<bool>
{
	public int Id { get; set; }
	public ContactMessageStatus? Status { get; set; }
	public bool? IsSpam { get; set; }
	public bool? IsStarred { get; set; }
	public bool? IsArchived { get; set; }
	public string? InternalNotes { get; set; }
}
