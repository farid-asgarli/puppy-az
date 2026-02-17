using PetWebsite.Application.Common.Interfaces;

namespace PetWebsite.Application.Features.ContactMessages.Commands;

/// <summary>
/// Command for deleting a contact message permanently.
/// </summary>
public class DeleteContactMessageCommand : ICommand<bool>
{
	public int Id { get; set; }
}
