namespace Common.Repository.Abstraction;

public interface IDynamicQueryRepository
{
    IQueryBuilder<TEntity> WithQuery<TEntity>(IQueryable<TEntity> query)
        where TEntity : class;
}
