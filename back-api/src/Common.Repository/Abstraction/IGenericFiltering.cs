using System.Linq.Expressions;
using Common.Repository.Filtering;

namespace Common.Repository.Abstraction;

public interface IGenericFiltering
{
    Expression<Func<T, bool>> BuildFilterExpression<T>(FilterSpecification spec);
}
