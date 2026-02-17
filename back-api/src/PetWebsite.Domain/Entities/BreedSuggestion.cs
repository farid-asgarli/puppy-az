using PetWebsite.Domain.Common;

namespace PetWebsite.Domain.Entities;

/// <summary>
/// Represents a breed suggestion submitted by a user when they can't find their pet's breed.
/// </summary>
public class BreedSuggestion : AuditableEntity
{
	/// <summary>
	/// The suggested breed name entered by the user.
	/// </summary>
	public string Name { get; set; } = string.Empty;

	/// <summary>
	/// The category this breed suggestion belongs to.
	/// </summary>
	public int PetCategoryId { get; set; }

	/// <summary>
	/// The user who suggested this breed.
	/// </summary>
	public Guid? UserId { get; set; }

	/// <summary>
	/// Status of the suggestion: Pending, Approved, Rejected
	/// </summary>
	public BreedSuggestionStatus Status { get; set; } = BreedSuggestionStatus.Pending;

	/// <summary>
	/// If approved, the breed ID that was created from this suggestion.
	/// </summary>
	public int? ApprovedBreedId { get; set; }

	/// <summary>
	/// Admin note (e.g., rejection reason).
	/// </summary>
	public string? AdminNote { get; set; }

	// Navigation properties
	public PetCategory Category { get; set; } = null!;
	public User? User { get; set; }
	public PetBreed? ApprovedBreed { get; set; }
}

/// <summary>
/// Status of a breed suggestion.
/// </summary>
public enum BreedSuggestionStatus
{
	Pending = 0,
	Approved = 1,
	Rejected = 2
}
