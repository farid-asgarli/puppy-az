using System.Text.Json;
using Common.Repository.Models;

namespace Common.Repository.Filtering;

public class FilterEntryDetails
{
	public string Key { get; init; } = null!;
	public JsonElement Value { get; init; }
	public FilterEquations Equation { get; init; } = FilterEquations.CONTAINS;
}

public class FilterSpecification
{
	public IEnumerable<FilterEntryDetails>? Entries { get; init; }
	public LogicalOperators LogicalOperator { get; init; } = LogicalOperators.AND_ALSO;
}
