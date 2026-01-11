using System.Linq.Expressions;
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
