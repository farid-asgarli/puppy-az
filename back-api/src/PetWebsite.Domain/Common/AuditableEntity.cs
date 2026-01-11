namespace PetWebsite.Domain.Common;

/// <summary>
/// Auditable entity with created and updated timestamps.
/// </summary>
/// <typeparam name="TKey">Type of the primary key</typeparam>
public abstract class AuditableEntity<TKey> : BaseEntity<TKey>, IAuditable
{
	/// <summary>
	/// Gets or sets the date and time when the entity was created.
	/// </summary>
	public DateTime CreatedAt { get; set; }

	/// <summary>
	/// Gets or sets the date and time when the entity was last updated.
	/// </summary>
	public DateTime? UpdatedAt { get; set; }

	/// <summary>
	/// Gets or sets the user ID who created the entity.
	/// </summary>
	public Guid? CreatedBy { get; set; }

	/// <summary>
	/// Gets or sets the user ID who last updated the entity.
	/// </summary>
	public Guid? UpdatedBy { get; set; }
}

/// <summary>
/// Auditable entity with integer Id and audit fields.
/// </summary>
public abstract class AuditableEntity : AuditableEntity<int> { }
