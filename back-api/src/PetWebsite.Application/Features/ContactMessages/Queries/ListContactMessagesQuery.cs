using Common.Repository.Filtering;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.ContactMessages.Queries;

public class ListContactMessagesQuery : QuerySpecification, ICommand<PaginatedResult<ContactMessageListItemDto>>
{
	/// <summary>
	/// Filter by status (New, Read, Replied).
	/// </summary>
	public int? Status { get; set; }

	/// <summary>
	/// Filter by message type.
	/// </summary>
	public int? MessageType { get; set; }

	/// <summary>
	/// Filter by spam flag.
	/// </summary>
	public bool? IsSpam { get; set; }

	/// <summary>
	/// Filter by starred flag.
	/// </summary>
	public bool? IsStarred { get; set; }

	/// <summary>
	/// Filter by archived flag.
	/// </summary>
	public bool? IsArchived { get; set; }

	/// <summary>
	/// Search in sender name, email, subject, message.
	/// </summary>
	public string? Search { get; set; }
}
