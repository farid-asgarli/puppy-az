using PetWebsite.Application.Common.Interfaces;

namespace PetWebsite.Application.Features.ContactMessages.Queries;

public class GetContactMessageQuery : ICommand<ContactMessageDetailDto?>
{
	public int Id { get; set; }

	/// <summary>
	/// Whether to mark the message as read when retrieving.
	/// </summary>
	public bool MarkAsRead { get; set; } = true;
}
