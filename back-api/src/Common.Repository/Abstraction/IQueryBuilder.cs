using System.Linq.Expressions;
using Common.Repository.Filtering;

namespace Common.Repository.Abstraction;

public interface IQueryBuilder<TEntity>
    where TEntity : class
{
    // Filtering
    IQueryBuilder<TEntity> ApplyFilters(FilterSpecification? specification);
    IQueryBuilder<TEntity> ApplyPredicate(
        Func<IQueryable<TEntity>, IQueryable<TEntity>>? predicate
    );
    IQueryBuilder<TEntity> Where(Expression<Func<TEntity, bool>> predicate);

    // Ordering
    IQueryBuilder<TEntity> ApplySorting(List<SortEntry>? sortEntries, string? defaultSortKey = null, SortDirection defaultDirection = SortDirection.Descending);
    IQueryBuilder<TEntity> OrderBy<TKey>(Expression<Func<TEntity, TKey>> keySelector);
    IQueryBuilder<TEntity> OrderByDescending<TKey>(Expression<Func<TEntity, TKey>> keySelector);
    IQueryBuilder<TEntity> ThenBy<TKey>(Expression<Func<TEntity, TKey>> keySelector);
    IQueryBuilder<TEntity> ThenByDescending<TKey>(Expression<Func<TEntity, TKey>> keySelector);

    // Pagination
    IQueryBuilder<TEntity> ApplyPagination(PaginationSpecification? specification);
    IQueryBuilder<TEntity> Skip(int count);
    IQueryBuilder<TEntity> Take(int count);

    // Includes
    IQueryBuilder<TEntity> Include(Expression<Func<TEntity, object>> navigationProperty);

    // Tracking
    IQueryBuilder<TEntity> AsNoTracking();
    IQueryBuilder<TEntity> AsTracking();

    // Operations
    IQueryBuilder<TEntity> Distinct();

    // Execution
    Task<(IReadOnlyList<TEntity> Items, int TotalCount)> ToListWithCountAsync(
        CancellationToken ct = default
    );
    Task<IReadOnlyList<TEntity>> ToListAsync(CancellationToken ct = default);
    Task<TEntity?> FirstOrDefaultAsync(CancellationToken ct = default);
    Task<TEntity?> SingleOrDefaultAsync(CancellationToken ct = default);
    Task<int> CountAsync(CancellationToken ct = default);
    Task<bool> AnyAsync(CancellationToken ct = default);

    // Raw queryable access (use with caution)
    IQueryable<TEntity> AsQueryable();
}
