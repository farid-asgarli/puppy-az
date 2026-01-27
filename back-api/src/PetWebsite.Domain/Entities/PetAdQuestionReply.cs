using PetWebsite.Domain.Common;

namespace PetWebsite.Domain.Entities;

/// <summary>
/// Represents a reply to a question on a pet advertisement.
/// Any user can reply to a question (Facebook-style comment system).
/// </summary>
public class PetAdQuestionReply : AuditableEntity<int>
{
	/// <summary>
	/// The ID of the question this reply belongs to.
	/// </summary>
	public int QuestionId { get; set; }

	/// <summary>
	/// The ID of the user who wrote the reply.
	/// </summary>
	public Guid UserId { get; set; }

	/// <summary>
	/// The reply text.
	/// </summary>
	public string Text { get; set; } = null!;

	/// <summary>
	/// Indicates whether the user is the ad owner.
	/// </summary>
	public bool IsOwnerReply { get; set; }

	/// <summary>
	/// Indicates whether the reply has been deleted (soft delete).
	/// </summary>
	public bool IsDeleted { get; set; }

	// Navigation properties
	public virtual PetAdQuestion Question { get; set; } = null!;
	public virtual User User { get; set; } = null!;
}
