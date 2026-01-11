namespace PetWebsite.Domain.Enums;

/// <summary>
/// Represents the status of a pet advertisement.
/// </summary>
public enum PetAdStatus
{
	/// <summary>
	/// Ad is pending review by an administrator.
	/// </summary>
	Pending = 0,

	/// <summary>
	/// Ad has been approved and is visible to users.
	/// </summary>
	Published = 1,

	/// <summary>
	/// Ad was rejected by an administrator and is not visible.
	/// </summary>
	Rejected = 2,

	/// <summary>
	/// Ad has expired and is no longer visible.
	/// </summary>
	Expired = 3,

	/// <summary>
	/// Ad was closed by the owner (e.g., pet was sold/adopted).
	/// </summary>
	Closed = 4,

	/// <summary>
	/// Ad is saved as draft and not yet submitted.
	/// </summary>
	Draft = 5,
}
