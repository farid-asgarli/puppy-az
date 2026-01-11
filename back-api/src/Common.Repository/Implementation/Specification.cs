using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;

namespace Common.Repository.Implementation;

/// <summary>
/// Base specification class which can be used to define specific business rules for any given entity.
/// </summary>
/// <typeparam name="T">The type of the entity.</typeparam>
public class BaseSpecification<T>
    where T : class
{
    /// <summary>
    /// Initializes a new instance of the <see cref="BaseSpecification{T}"/> class.
    /// </summary>
    public BaseSpecification()
    {
        Includes = [];
        IncludeStrings = [];
    }

    /// <summary>
    /// Initializes a new instance of the <see cref="BaseSpecification{T}"/> class with specific criteria.
    /// </summary>
    /// <param name="criteria">The criteria.</param>
    public BaseSpecification(Expression<Func<T, bool>>? criteria)
        : this()
    {
        Criteria = criteria;
    }

    public Expression<Func<T, bool>>? Criteria { get; }
    public List<Expression<Func<T, object>>> Includes { get; }
    public List<string> IncludeStrings { get; }
    public Expression<Func<T, object>>? OrderBy { get; private set; }
    public Expression<Func<T, object>>? OrderByDescending { get; private set; }
    public bool AsNoTracking { get; private set; }

    /// <summary>
    /// Adds a related entity to be included in the query results using a lambda expression.
    /// </summary>
    /// <param name="includeExpression">The lambda expression representing the property to include.</param>
    public virtual BaseSpecification<T> AddInclude(Expression<Func<T, object>> includeExpression)
    {
        Includes.Add(includeExpression);
        return this;
    }

    /// <summary>
    /// Adds a related entity to be included in the query results using a string path.
    /// </summary>
    /// <param name="includeString">The string path representing the property to include.</param>
    public virtual BaseSpecification<T> AddInclude(string includeString)
    {
        IncludeStrings.Add(includeString);
        return this;
    }

    /// <summary>
    /// Sets the property to order the query results by, in ascending order.
    /// </summary>
    /// <param name="orderByExpression">The lambda expression representing the property to order by.</param>
    public virtual BaseSpecification<T> ApplyOrderBy(Expression<Func<T, object>> orderByExpression)
    {
        OrderBy = orderByExpression;
        return this;
    }

    /// <summary>
    /// Sets the property to order the query results by, in descending order.
    /// </summary>
    /// <param name="orderByDescendingExpression">The lambda expression representing the property to order by in descending order.</param>
    public virtual BaseSpecification<T> ApplyOrderByDescending(
        Expression<Func<T, object>> orderByDescendingExpression
    )
    {
        OrderByDescending = orderByDescendingExpression;
        return this;
    }

    /// <summary>
    /// Sets the query to be executed without tracking.
    /// </summary>
    public virtual BaseSpecification<T> ApplyNoTracking()
    {
        AsNoTracking = true;
        return this;
    }
}

/// <summary>
/// Evaluates specifications against a queryable.
/// </summary>
/// <typeparam name="T">The type of the entity.</typeparam>
public class SpecificationEvaluator<T>
    where T : class
{
    /// <summary>
    /// Evaluates the specified specification against the input query.
    /// </summary>
    /// <param name="inputQuery">The input query.</param>
    /// <param name="spec">The specification.</param>
    /// <returns>A queryable with the specification applied.</returns>
    public static IQueryable<T> GetQuery(IQueryable<T> inputQuery, BaseSpecification<T> spec)
    {
        var query = inputQuery;

        // Apply criteria
        if (spec.Criteria != null)
            query = query.Where(spec.Criteria);

        // Apply as no tracking
        if (spec.AsNoTracking)
            query = query.AsNoTracking();

        // Apply order by
        if (spec.OrderBy != null)
            query = query.OrderBy(spec.OrderBy);

        // Apply order by descending
        if (spec.OrderByDescending is not null)
            query = query.OrderByDescending(spec.OrderByDescending);

        // Apply includes for each include expression
        query = spec.Includes.Aggregate(query, (current, include) => current.Include(include));

        // Apply includes for each include string
        query = spec.IncludeStrings.Aggregate(
            query,
            (current, include) => current.Include(include)
        );

        return query;
    }
}
