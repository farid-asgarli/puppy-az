using System.Linq.Expressions;
using System.Reflection;
using Common.Repository.Abstraction;
using Common.Repository.Filtering;
using Microsoft.EntityFrameworkCore;

namespace Common.Repository.Implementation;

public class QueryBuilder<TEntity>(IQueryable<TEntity> query, IGenericFiltering genericFiltering) : IQueryBuilder<TEntity>
	where TEntity : class
{
	private IQueryable<TEntity> _query = query ?? throw new ArgumentNullException(nameof(query));
	private readonly IGenericFiltering _genericFiltering = genericFiltering ?? throw new ArgumentNullException(nameof(genericFiltering));
	private PaginationSpecification? _paginationSpecification;
	private bool _isOrdered;

	public IQueryBuilder<TEntity> ApplyFilters(FilterSpecification? specification)
	{
		if (specification?.Entries?.Any() == true)
		{
			var filterExpression = _genericFiltering.BuildFilterExpression<TEntity>(specification);
			if (filterExpression != null)
			{
				_query = _query.Where(filterExpression);
			}
		}

		return this;
	}

	public IQueryBuilder<TEntity> ApplyPredicate(Func<IQueryable<TEntity>, IQueryable<TEntity>>? predicate)
	{
		if (predicate != null)
		{
			_query = predicate(_query);
		}

		return this;
	}

	public IQueryBuilder<TEntity> Where(Expression<Func<TEntity, bool>> predicate)
	{
		ArgumentNullException.ThrowIfNull(predicate);
		_query = _query.Where(predicate);
		return this;
	}

	public IQueryBuilder<TEntity> ApplySorting(List<SortEntry>? sortEntries, string? defaultSortKey = null, SortDirection defaultDirection = SortDirection.Descending)
	{
		// If no sort entries provided, apply default sort if specified
		if (sortEntries == null || sortEntries.Count == 0)
		{
			if (!string.IsNullOrEmpty(defaultSortKey))
			{
				ApplySingleSort(defaultSortKey, defaultDirection, isFirst: true);
			}
			return this;
		}

		// Apply each sort entry in order
		for (int i = 0; i < sortEntries.Count; i++)
		{
			var entry = sortEntries[i];
			ApplySingleSort(entry.Key, entry.Direction, isFirst: i == 0);
		}

		return this;
	}

	private void ApplySingleSort(string key, SortDirection direction, bool isFirst)
	{
		// Get property info - try exact match first, then case-insensitive
		var propertyInfo = typeof(TEntity).GetProperty(key, BindingFlags.Public | BindingFlags.Instance)
			?? typeof(TEntity).GetProperty(key, BindingFlags.Public | BindingFlags.Instance | BindingFlags.IgnoreCase);

		if (propertyInfo == null)
		{
			// Property not found, skip this sort entry
			return;
		}

		// Build the lambda expression for the property
		var parameter = Expression.Parameter(typeof(TEntity), "x");
		var propertyAccess = Expression.Property(parameter, propertyInfo);
		var lambda = Expression.Lambda(propertyAccess, parameter);

		// Get the appropriate OrderBy method
		string methodName;
		if (isFirst && !_isOrdered)
		{
			methodName = direction == SortDirection.Ascending ? "OrderBy" : "OrderByDescending";
		}
		else
		{
			methodName = direction == SortDirection.Ascending ? "ThenBy" : "ThenByDescending";
		}

		// Create the method call expression
		var method = typeof(Queryable).GetMethods()
			.Where(m => m.Name == methodName && m.GetParameters().Length == 2)
			.Single()
			.MakeGenericMethod(typeof(TEntity), propertyInfo.PropertyType);

		_query = (IQueryable<TEntity>)method.Invoke(null, [_query, lambda])!;
		_isOrdered = true;
	}

	public IQueryBuilder<TEntity> ApplyPagination(PaginationSpecification? specification)
	{
		if (specification != null)
		{
			if (specification.Number.HasValue && specification.Number.Value < 1)
				throw new ArgumentException("Page number must be >= 1", nameof(specification));

			if (specification.Size.HasValue && specification.Size.Value < 1)
				throw new ArgumentException("Page size must be >= 1", nameof(specification));
		}

		_paginationSpecification = specification;
		return this;
	}

	public IQueryBuilder<TEntity> OrderBy<TKey>(Expression<Func<TEntity, TKey>> keySelector)
	{
		ArgumentNullException.ThrowIfNull(keySelector);
		_query = _query.OrderBy(keySelector);
		_isOrdered = true;
		return this;
	}

	public IQueryBuilder<TEntity> OrderByDescending<TKey>(Expression<Func<TEntity, TKey>> keySelector)
	{
		ArgumentNullException.ThrowIfNull(keySelector);
		_query = _query.OrderByDescending(keySelector);
		_isOrdered = true;
		return this;
	}

	public IQueryBuilder<TEntity> ThenBy<TKey>(Expression<Func<TEntity, TKey>> keySelector)
	{
		ArgumentNullException.ThrowIfNull(keySelector);

		if (!_isOrdered)
			throw new InvalidOperationException("ThenBy can only be used after OrderBy or OrderByDescending");

		_query = ((IOrderedQueryable<TEntity>)_query).ThenBy(keySelector);
		return this;
	}

	public IQueryBuilder<TEntity> ThenByDescending<TKey>(Expression<Func<TEntity, TKey>> keySelector)
	{
		ArgumentNullException.ThrowIfNull(keySelector);

		if (!_isOrdered)
			throw new InvalidOperationException("ThenByDescending can only be used after OrderBy or OrderByDescending");

		_query = ((IOrderedQueryable<TEntity>)_query).ThenByDescending(keySelector);
		return this;
	}

	public IQueryBuilder<TEntity> Include(Expression<Func<TEntity, object>> navigationProperty)
	{
		ArgumentNullException.ThrowIfNull(navigationProperty);
		_query = _query.Include(navigationProperty);
		return this;
	}

	public IQueryBuilder<TEntity> AsNoTracking()
	{
		_query = _query.AsNoTracking();
		return this;
	}

	public IQueryBuilder<TEntity> AsTracking()
	{
		_query = _query.AsTracking();
		return this;
	}

	public IQueryBuilder<TEntity> Skip(int count)
	{
		if (count < 0)
			throw new ArgumentOutOfRangeException(nameof(count), "Skip count must be >= 0");

		_query = _query.Skip(count);
		return this;
	}

	public IQueryBuilder<TEntity> Take(int count)
	{
		if (count < 1)
			throw new ArgumentOutOfRangeException(nameof(count), "Take count must be >= 1");

		_query = _query.Take(count);
		return this;
	}

	public IQueryBuilder<TEntity> Distinct()
	{
		_query = _query.Distinct();
		return this;
	}

	public async Task<(IReadOnlyList<TEntity> Items, int TotalCount)> ToListWithCountAsync(CancellationToken ct = default)
	{
		var totalCount = await _query.CountAsync(ct);
		var items = await ApplyPaginationInternal().ToListAsync(ct);
		return (items, totalCount);
	}

	public async Task<IReadOnlyList<TEntity>> ToListAsync(CancellationToken ct = default)
	{
		return await ApplyPaginationInternal().ToListAsync(ct);
	}

	public async Task<TEntity?> FirstOrDefaultAsync(CancellationToken ct = default)
	{
		return await _query.FirstOrDefaultAsync(ct);
	}

	public async Task<TEntity?> SingleOrDefaultAsync(CancellationToken ct = default)
	{
		return await _query.SingleOrDefaultAsync(ct);
	}

	public async Task<int> CountAsync(CancellationToken ct = default)
	{
		return await _query.CountAsync(ct);
	}

	public async Task<bool> AnyAsync(CancellationToken ct = default)
	{
		return await _query.AnyAsync(ct);
	}

	public IQueryable<TEntity> AsQueryable()
	{
		return _query;
	}

	private IQueryable<TEntity> ApplyPaginationInternal()
	{
		if (_paginationSpecification == null || !_paginationSpecification.Number.HasValue || !_paginationSpecification.Size.HasValue)
		{
			return _query;
		}

		var pageNumber = _paginationSpecification.Number.Value;
		var pageSize = _paginationSpecification.Size.Value;

		return _query.Skip((pageNumber - 1) * pageSize).Take(pageSize);
	}
}
