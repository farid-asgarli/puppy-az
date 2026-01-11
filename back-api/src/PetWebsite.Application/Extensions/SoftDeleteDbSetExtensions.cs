using Microsoft.EntityFrameworkCore;
using PetWebsite.Domain.Common;

namespace PetWebsite.Application.Extensions;

/// <summary>
/// Extension methods for DbSet and IApplicationDbContext to handle soft delete operations.
/// These extensions work directly with EF Core without the Repository pattern.
/// </summary>
public static class SoftDeleteDbSetExtensions
{
	/// <summary>
	/// Soft deletes an entity by its ID using DbContext.
	/// </summary>
	/// <typeparam name="TEntity">The entity type that inherits from SoftDeletableEntity.</typeparam>
	/// <typeparam name="TKey">The type of the primary key.</typeparam>
	/// <param name="dbSet">The DbSet instance.</param>
	/// <param name="id">The ID of the entity to soft delete.</param>
	/// <param name="deletedBy">The user ID who is performing the deletion.</param>
	/// <param name="ct">Cancellation token.</param>
	/// <returns>True if the entity was found and soft deleted; otherwise, false.</returns>
	public static async Task<bool> SoftDeleteByIdAsync<TEntity, TKey>(
		this DbSet<TEntity> dbSet,
		TKey id,
		Guid? deletedBy = null,
		CancellationToken ct = default
	)
		where TEntity : SoftDeletableEntity<TKey>
	{
		var entity = await dbSet.FindAsync([id!], ct);
		if (entity == null)
			return false;

		entity.SoftDelete(deletedBy);
		return true;
	}

	/// <summary>
	/// Restores a soft-deleted entity by its ID.
	/// </summary>
	/// <typeparam name="TEntity">The entity type that inherits from SoftDeletableEntity.</typeparam>
	/// <typeparam name="TKey">The type of the primary key.</typeparam>
	/// <param name="dbSet">The DbSet instance.</param>
	/// <param name="id">The ID of the entity to restore.</param>
	/// <param name="ct">Cancellation token.</param>
	/// <returns>True if the entity was found and restored; otherwise, false.</returns>
	public static async Task<bool> RestoreByIdAsync<TEntity, TKey>(this DbSet<TEntity> dbSet, TKey id, CancellationToken ct = default)
		where TEntity : SoftDeletableEntity<TKey>
	{
		var entity = await dbSet
			.IgnoreQueryFilters() // Include soft-deleted entities
			.FirstOrDefaultAsync(e => e.Id!.Equals(id) && e.IsDeleted, ct);

		if (entity == null)
			return false;

		entity.Restore();
		return true;
	}

	/// <summary>
	/// Gets a queryable that excludes soft-deleted entities.
	/// </summary>
	/// <typeparam name="TEntity">The entity type that inherits from SoftDeletableEntity.</typeparam>
	/// <typeparam name="TKey">The type of the primary key.</typeparam>
	/// <param name="dbSet">The DbSet instance.</param>
	/// <returns>A queryable excluding soft-deleted entities.</returns>
	public static IQueryable<TEntity> WhereNotDeleted<TEntity, TKey>(this DbSet<TEntity> dbSet)
		where TEntity : SoftDeletableEntity<TKey>
	{
		return dbSet.Where(e => !e.IsDeleted);
	}

	/// <summary>
	/// Gets a queryable that includes only soft-deleted entities.
	/// </summary>
	/// <typeparam name="TEntity">The entity type that inherits from SoftDeletableEntity.</typeparam>
	/// <typeparam name="TKey">The type of the primary key.</typeparam>
	/// <param name="dbSet">The DbSet instance.</param>
	/// <returns>A queryable for only soft-deleted entities.</returns>
	public static IQueryable<TEntity> WhereDeleted<TEntity, TKey>(this DbSet<TEntity> dbSet)
		where TEntity : SoftDeletableEntity<TKey>
	{
		return dbSet.IgnoreQueryFilters().Where(e => e.IsDeleted);
	}

	/// <summary>
	/// Gets a queryable that includes both active and soft-deleted entities.
	/// </summary>
	/// <typeparam name="TEntity">The entity type that inherits from SoftDeletableEntity.</typeparam>
	/// <typeparam name="TKey">The type of the primary key.</typeparam>
	/// <param name="dbSet">The DbSet instance.</param>
	/// <returns>A queryable including all entities regardless of deletion status.</returns>
	public static IQueryable<TEntity> IncludeDeleted<TEntity, TKey>(this DbSet<TEntity> dbSet)
		where TEntity : SoftDeletableEntity<TKey>
	{
		return dbSet.IgnoreQueryFilters();
	}

	/// <summary>
	/// Counts non-deleted entities.
	/// </summary>
	/// <typeparam name="TEntity">The entity type that inherits from SoftDeletableEntity.</typeparam>
	/// <typeparam name="TKey">The type of the primary key.</typeparam>
	/// <param name="dbSet">The DbSet instance.</param>
	/// <param name="ct">Cancellation token.</param>
	/// <returns>The count of non-deleted entities.</returns>
	public static async Task<int> CountNotDeletedAsync<TEntity, TKey>(this DbSet<TEntity> dbSet, CancellationToken ct = default)
		where TEntity : SoftDeletableEntity<TKey>
	{
		return await dbSet.CountAsync(e => !e.IsDeleted, ct);
	}

	/// <summary>
	/// Counts soft-deleted entities.
	/// </summary>
	/// <typeparam name="TEntity">The entity type that inherits from SoftDeletableEntity.</typeparam>
	/// <typeparam name="TKey">The type of the primary key.</typeparam>
	/// <param name="dbSet">The DbSet instance.</param>
	/// <param name="ct">Cancellation token.</param>
	/// <returns>The count of soft-deleted entities.</returns>
	public static async Task<int> CountDeletedAsync<TEntity, TKey>(this DbSet<TEntity> dbSet, CancellationToken ct = default)
		where TEntity : SoftDeletableEntity<TKey>
	{
		return await dbSet.IgnoreQueryFilters().CountAsync(e => e.IsDeleted, ct);
	}

	/// <summary>
	/// Checks if a non-deleted entity exists with the specified ID.
	/// </summary>
	/// <typeparam name="TEntity">The entity type that inherits from SoftDeletableEntity.</typeparam>
	/// <typeparam name="TKey">The type of the primary key.</typeparam>
	/// <param name="dbSet">The DbSet instance.</param>
	/// <param name="id">The ID to check.</param>
	/// <param name="ct">Cancellation token.</param>
	/// <returns>True if a non-deleted entity with the ID exists; otherwise, false.</returns>
	public static async Task<bool> ExistsNotDeletedAsync<TEntity, TKey>(this DbSet<TEntity> dbSet, TKey id, CancellationToken ct = default)
		where TEntity : SoftDeletableEntity<TKey>
	{
		return await dbSet.AnyAsync(e => e.Id!.Equals(id) && !e.IsDeleted, ct);
	}

	/// <summary>
	/// Finds an entity by ID, optionally including soft-deleted entities.
	/// </summary>
	/// <typeparam name="TEntity">The entity type that inherits from SoftDeletableEntity.</typeparam>
	/// <typeparam name="TKey">The type of the primary key.</typeparam>
	/// <param name="dbSet">The DbSet instance.</param>
	/// <param name="id">The ID of the entity to find.</param>
	/// <param name="includeDeleted">Whether to include soft-deleted entities.</param>
	/// <param name="ct">Cancellation token.</param>
	/// <returns>The entity if found; otherwise, null.</returns>
	public static async Task<TEntity?> FindByIdAsync<TEntity, TKey>(
		this DbSet<TEntity> dbSet,
		TKey id,
		bool includeDeleted = false,
		CancellationToken ct = default
	)
		where TEntity : SoftDeletableEntity<TKey>
	{
		var query = includeDeleted ? dbSet.IgnoreQueryFilters() : dbSet.AsQueryable();

		return await query.FirstOrDefaultAsync(e => e.Id!.Equals(id), ct);
	}

	/// <summary>
	/// Permanently deletes soft-deleted entities that were deleted before a specified date.
	/// This performs a hard delete on entities that have been soft-deleted for a certain period.
	/// </summary>
	/// <typeparam name="TEntity">The entity type that inherits from SoftDeletableEntity.</typeparam>
	/// <typeparam name="TKey">The type of the primary key.</typeparam>
	/// <param name="dbSet">The DbSet instance.</param>
	/// <param name="deletedBefore">The date threshold. Entities deleted before this date will be permanently removed.</param>
	/// <param name="ct">Cancellation token.</param>
	/// <returns>The number of entities that were permanently deleted.</returns>
	public static async Task<int> PermanentlyDeleteOldAsync<TEntity, TKey>(
		this DbSet<TEntity> dbSet,
		DateTime deletedBefore,
		CancellationToken ct = default
	)
		where TEntity : SoftDeletableEntity<TKey>
	{
		var entities = await dbSet
			.IgnoreQueryFilters()
			.Where(e => e.IsDeleted && e.DeletedAt != null && e.DeletedAt < deletedBefore)
			.ToListAsync(ct);

		if (entities.Count == 0)
			return 0;

		dbSet.RemoveRange(entities);
		return entities.Count;
	}
}
