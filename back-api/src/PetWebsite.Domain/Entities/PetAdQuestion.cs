using PetWebsite.Domain.Common;

namespace PetWebsite.Domain.Entities;

/// <summary>
/// Represents a question asked by a user on a pet advertisement.
/// </summary>
public class PetAdQuestion : AuditableEntity<int>
{
	/// <summary>
	/// The ID of the pet advertisement this question belongs to.
	/// </summary>
	public int PetAdId { get; set; }

	/// <summary>
	/// The ID of the user who asked the question.
	/// </summary>
	public Guid UserId { get; set; }

	/// <summary>
	/// The question text.
	/// </summary>
	public string Question { get; set; } = null!;

	/// <summary>
	/// The answer text provided by the ad owner.
	/// </summary>
	public string? Answer { get; set; }

	/// <summary>
	/// The date and time when the question was answered.
	/// </summary>
	public DateTime? AnsweredAt { get; set; }

	/// <summary>
	/// Indicates whether the question has been deleted (soft delete).
	/// </summary>
	public bool IsDeleted { get; set; }

	// Navigation properties
	public virtual PetAd PetAd { get; set; } = null!;
	public virtual User User { get; set; } = null!;
}
