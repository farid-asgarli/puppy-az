namespace Common.Repository.Filtering;

/// <summary>
/// Sort direction enum
/// </summary>
public enum SortDirection
{
	Ascending = 0,
	Descending = 1
}

/// <summary>
/// A single sort entry specifying the field and direction
/// </summary>
public class SortEntry
{
	/// <summary>
	/// The property key to sort by (e.g., "createdAt", "price")
	/// </summary>
	public string Key { get; init; } = string.Empty;

	/// <summary>
	/// The sort direction (ascending or descending)
	/// </summary>
	public SortDirection Direction { get; init; } = SortDirection.Ascending;
}

/// <summary>
/// Specification for sorting results
/// </summary>
public class SortingSpecification
{
	/// <summary>
	/// List of sort entries to apply in order
	/// </summary>
	public List<SortEntry>? Entries { get; init; }
}
