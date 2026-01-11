namespace PetWebsite.Domain.Common;

/// <summary>
/// Auditable entity with soft delete capability.
/// </summary>
/// <typeparam name="TKey">Type of the primary key</typeparam>
public abstract class SoftDeletableEntity<TKey> : AuditableEntity<TKey>
{
	/// <summary>
	/// Gets or sets a value indicating whether the entity is deleted.
	/// </summary>
	public bool IsDeleted { get; set; }

	/// <summary>
	/// Gets or sets the date and time when the entity was deleted.
	/// </summary>
	public DateTime? DeletedAt { get; set; }

	/// <summary>
	/// Gets or sets the user ID who deleted the entity.
	/// </summary>
	public Guid? DeletedBy { get; set; }

	/// <summary>
	/// Marks the entity as deleted.
	/// </summary>
	/// <param name="deletedBy">User ID who performed the deletion</param>
	public void SoftDelete(Guid? deletedBy = null)
	{
		IsDeleted = true;
		DeletedAt = DateTime.UtcNow;
		DeletedBy = deletedBy;
	}

	/// <summary>
	/// Restores a soft-deleted entity.
	/// </summary>
	public void Restore()
	{
		IsDeleted = false;
		DeletedAt = null;
		DeletedBy = null;
	}
}

/// <summary>
/// Soft deletable entity with integer Id.
/// </summary>
public abstract class SoftDeletableEntity : SoftDeletableEntity<int> { }
