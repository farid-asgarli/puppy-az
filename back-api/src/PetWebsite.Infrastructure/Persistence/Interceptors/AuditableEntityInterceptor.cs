using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Domain.Common;

namespace PetWebsite.Infrastructure.Persistence.Interceptors;

/// <summary>
/// Interceptor to automatically set audit fields on entities.
/// </summary>
public sealed class AuditableEntityInterceptor(ICurrentUserService currentUserService, TimeProvider timeProvider) : SaveChangesInterceptor
{
	public override InterceptionResult<int> SavingChanges(DbContextEventData eventData, InterceptionResult<int> result)
	{
		UpdateAuditableEntities(eventData.Context);
		return base.SavingChanges(eventData, result);
	}

	public override ValueTask<InterceptionResult<int>> SavingChangesAsync(
		DbContextEventData eventData,
		InterceptionResult<int> result,
		CancellationToken cancellationToken = default
	)
	{
		UpdateAuditableEntities(eventData.Context);
		return base.SavingChangesAsync(eventData, result, cancellationToken);
	}

	private void UpdateAuditableEntities(DbContext? context)
	{
		if (context is null)
			return;

		var currentUser = currentUserService.UserId;
		var now = timeProvider.GetUtcNow().UtcDateTime;

		foreach (
			var entry in context
				.ChangeTracker.Entries()
				.Where(e => e.State is EntityState.Added or EntityState.Modified or EntityState.Deleted)
		)
		{
			// Handle soft delete conversion
			if (entry.State == EntityState.Deleted && entry.Entity is SoftDeletableEntity softDeletable)
			{
				entry.State = EntityState.Modified;
				softDeletable.SoftDelete(currentUser);
				continue; // Skip audit update since SoftDelete handles it
			}

			// Handle audit fields - single pattern match
			if (entry.Entity is IAuditable auditable)
			{
				if (entry.State == EntityState.Added)
				{
					auditable.CreatedAt = now;
					auditable.CreatedBy = currentUser;
					auditable.UpdatedAt = null;
				}
				else if (entry.State == EntityState.Modified)
				{
					auditable.UpdatedAt = now;
					auditable.UpdatedBy = currentUser;
				}
			}
		}
	}
}
