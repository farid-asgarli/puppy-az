namespace PetWebsite.Domain.Enums;

/// <summary>
/// Represents the type of pet advertisement.
/// </summary>
public enum PetAdType
{
	/// <summary>
	/// Pet is for sale.
	/// </summary>
	Sale = 1,

	/// <summary>
	/// Looking for a breeding match.
	/// </summary>
	Match = 2,

	/// <summary>
	/// Pet was found and looking for owner.
	/// </summary>
	Found = 3,

	/// <summary>
	/// Pet is lost and looking for it.
	/// </summary>
	Lost = 4,

	/// <summary>
	/// Sharing pet ownership/information.
	/// </summary>
	Owning = 5,
}
