namespace Common.Repository.Filtering;

public class QuerySpecification
{
	public PaginationSpecification? Pagination { get; init; }
	public FilterSpecification? Filter { get; init; }
	public List<SortEntry>? Sorting { get; init; }
}
