namespace PetWebsite.Domain.Enums;

/// <summary>
/// Type/source of a contact message.
/// </summary>
public enum ContactMessageType
{
	/// <summary>
	/// General contact form.
	/// </summary>
	General = 0,

	/// <summary>
	/// Support request.
	/// </summary>
	Support = 1,

	/// <summary>
	/// Bug report.
	/// </summary>
	BugReport = 2,

	/// <summary>
	/// Feature request/suggestion.
	/// </summary>
	FeatureRequest = 3,

	/// <summary>
	/// Complaint about an ad or user.
	/// </summary>
	Complaint = 4,

	/// <summary>
	/// Partnership inquiry.
	/// </summary>
	Partnership = 5,

	/// <summary>
	/// Advertising inquiry.
	/// </summary>
	Advertising = 6,

	/// <summary>
	/// Other type of message.
	/// </summary>
	Other = 99
}
