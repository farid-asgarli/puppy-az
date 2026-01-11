namespace PetWebsite.Domain.Common;

/// <summary>
/// Base entity with Id property.
/// </summary>
/// <typeparam name="TKey">Type of the primary key</typeparam>
public abstract class BaseEntity<TKey>
{
	/// <summary>
	/// Gets or sets the primary key.
	/// </summary>
	public TKey Id { get; set; } = default!;

	/// <summary>
	/// Checks if the entity is transient (not yet persisted).
	/// </summary>
	public bool IsTransient()
	{
		return Id == null || Id.Equals(default(TKey));
	}

	public override bool Equals(object? obj)
	{
		if (obj is not BaseEntity<TKey> other)
			return false;

		if (ReferenceEquals(this, other))
			return true;

		if (GetType() != other.GetType())
			return false;

		if (IsTransient() || other.IsTransient())
			return false;

		return Id!.Equals(other.Id);
	}

	public override int GetHashCode()
	{
		if (Id == null)
			return GetType().GetHashCode();

		return (GetType().ToString() + Id.ToString()).GetHashCode();
	}

	public static bool operator ==(BaseEntity<TKey>? a, BaseEntity<TKey>? b)
	{
		if (a is null && b is null)
			return true;

		if (a is null || b is null)
			return false;

		return a.Equals(b);
	}

	public static bool operator !=(BaseEntity<TKey>? a, BaseEntity<TKey>? b)
	{
		return !(a == b);
	}
}

/// <summary>
/// Base entity with integer Id.
/// </summary>
public abstract class BaseEntity : BaseEntity<int> { }
