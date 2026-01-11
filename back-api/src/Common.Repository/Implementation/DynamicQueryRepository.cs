using Common.Repository.Abstraction;

namespace Common.Repository.Implementation;

public class DynamicQueryRepository(IGenericFiltering genericFiltering) : IDynamicQueryRepository
{
    public IQueryBuilder<TEntity> WithQuery<TEntity>(IQueryable<TEntity> query)
        where TEntity : class => new QueryBuilder<TEntity>(query, genericFiltering);
}
