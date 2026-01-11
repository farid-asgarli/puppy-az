using System.Collections.Concurrent;
using System.Linq.Expressions;
using System.Reflection;
using System.Text.Json;
using Common.Repository.Abstraction;
using Common.Repository.Extensions;
using Common.Repository.Filtering;
using Common.Repository.Models;

namespace Common.Repository.Implementation;

public class GenericFiltering : IGenericFiltering
{
	// Caches
	private readonly ConcurrentDictionary<Type, PropertyInfo[]> _propertyCache = new();

	// Static method caches
	private static readonly MethodInfo StringContainsMethod = typeof(string).GetMethod(nameof(string.Contains), [typeof(string)])!;
	private static readonly MethodInfo StringStartsWithMethod = typeof(string).GetMethod(nameof(string.StartsWith), [typeof(string)])!;
	private static readonly MethodInfo StringEndsWithMethod = typeof(string).GetMethod(nameof(string.EndsWith), [typeof(string)])!;
	private static readonly MethodInfo StringToLowerMethod = typeof(string).GetMethod(nameof(string.ToLower), Type.EmptyTypes)!;

	private static readonly ConcurrentDictionary<Type, MethodInfo> EnumerableContainsMethods = new();
	private static readonly ConcurrentDictionary<Type, MethodInfo> EnumerableIntersectMethods = new();
	private static readonly ConcurrentDictionary<Type, MethodInfo> EnumerableAnyMethods = new();

	public Expression<Func<T, bool>> BuildFilterExpression<T>(FilterSpecification spec)
	{
		ArgumentNullException.ThrowIfNull(spec);

		if (spec.Entries == null || !spec.Entries.Any())
			return null!;

		var parameter = Expression.Parameter(typeof(T), "entity");
		Expression? predicate = null;

		var properties = _propertyCache.GetOrAdd(typeof(T), type => type.GetProperties());

		foreach (var filter in spec.Entries)
		{
			try
			{
				var propertyPath = filter.Key.ConvertCamelCaseToPascalCase().Split(':');

				var comparisonExpression = BuildNestedComparisonExpression(
					propertyPath,
					filter.Value,
					filter.Equation,
					properties,
					parameter
				);

				if (comparisonExpression != null)
				{
					predicate =
						predicate == null ? comparisonExpression
						: spec.LogicalOperator == LogicalOperators.OR_ELSE ? Expression.OrElse(predicate, comparisonExpression)
						: Expression.AndAlso(predicate, comparisonExpression);
				}
			}
			catch (Exception ex)
			{
				throw new InvalidOperationException($"Failed to build filter expression for property '{filter.Key}'", ex);
			}
		}

		if (predicate == null)
			return null!;

		return Expression.Lambda<Func<T, bool>>(predicate, parameter);
	}

	private Expression? BuildNestedComparisonExpression(
		string[] propertyPath,
		JsonElement propertyValue,
		FilterEquations eq,
		PropertyInfo[] properties,
		ParameterExpression parameter
	)
	{
		Expression propertyExpression = parameter;
		PropertyInfo? propertyInfo = null;
		var currentProperties = properties;

		foreach (var propName in propertyPath)
		{
			propertyInfo = currentProperties.FirstOrDefault(p => p.Name.Equals(propName, StringComparison.OrdinalIgnoreCase));

			if (propertyInfo == null)
				return null;

			propertyExpression = Expression.Property(propertyExpression, propertyInfo);

			currentProperties = _propertyCache.GetOrAdd(propertyInfo.PropertyType, type => type.GetProperties());
		}

		if (propertyInfo == null || propertyValue.ValueKind == JsonValueKind.Null || propertyValue.ValueKind == JsonValueKind.Undefined)
		{
			return null;
		}

		return BuildComparisonExpression(propertyInfo, propertyValue, eq, propertyExpression);
	}

	private static Expression? BuildComparisonExpression(
		PropertyInfo propertyInfo,
		JsonElement propertyValue,
		FilterEquations eq,
		Expression propertyExpression
	)
	{
		if (IsCollectionType(propertyInfo.PropertyType))
		{
			return BuildCollectionPropertyComparisonExpression(propertyInfo, propertyValue, eq, propertyExpression);
		}

		var propertyType = propertyInfo.PropertyType;

		return propertyType switch
		{
			Type t when t == typeof(string) && propertyValue.ValueKind == JsonValueKind.String => BuildStringComparisonExpression(
				propertyExpression,
				propertyValue,
				eq
			),

			Type t when t == typeof(char) && propertyValue.ValueKind == JsonValueKind.String => BuildCharComparisonExpression(
				propertyExpression,
				propertyValue,
				eq
			),

			Type t
				when t == typeof(bool)
					&& (propertyValue.ValueKind == JsonValueKind.True || propertyValue.ValueKind == JsonValueKind.False) =>
				BuildBoolComparisonExpression(propertyExpression, propertyValue, eq),

			Type t when (t.IsEnum || (Nullable.GetUnderlyingType(t)?.IsEnum ?? false)) && propertyValue.ValueKind == JsonValueKind.Number =>
				BuildEnumComparisonExpression(propertyExpression, propertyValue, eq, t),

			Type t
				when IsDateTimeType(t)
					&& (propertyValue.ValueKind == JsonValueKind.String || propertyValue.ValueKind == JsonValueKind.Object) =>
				BuildDateTimeComparisonExpression(propertyExpression, propertyValue, eq, t),

			Type t when (t == typeof(Guid) || t == typeof(Guid?)) && propertyValue.ValueKind == JsonValueKind.String =>
				BuildGuidComparisonExpression(propertyExpression, propertyValue, eq, t),

			Type t when propertyValue.ValueKind == JsonValueKind.Number || propertyValue.ValueKind == JsonValueKind.String =>
				BuildNumberComparisonExpression(propertyExpression, propertyValue, eq, t),

			Type t when propertyValue.ValueKind == JsonValueKind.Array => BuildArrayComparisonExpression(
				propertyExpression,
				propertyValue,
				t
			),

			_ => null,
		};
	}

	#region String Comparisons

	private static Expression BuildStringComparisonExpression(Expression propertyExpression, JsonElement propertyValue, FilterEquations eq)
	{
		var value = propertyValue.GetString();
		if (value == null)
			return Expression.Constant(false);

		var notNullCheck = Expression.NotEqual(propertyExpression, Expression.Constant(null, typeof(string)));

		var left = Expression.Call(propertyExpression, StringToLowerMethod);
		var constant = Expression.Constant(value.ToLower(), typeof(string));

		Expression comparison = eq switch
		{
			FilterEquations.CONTAINS => Expression.Call(left, StringContainsMethod, constant),
			FilterEquations.EQUALS => Expression.Equal(left, constant),
			FilterEquations.NOT_EQUALS => Expression.NotEqual(left, constant),
			FilterEquations.STARTS_WITH => Expression.Call(left, StringStartsWithMethod, constant),
			FilterEquations.ENDS_WITH => Expression.Call(left, StringEndsWithMethod, constant),
			FilterEquations.BIGGER => Expression.GreaterThan(left, constant),
			FilterEquations.BIGGER_EQUALS => Expression.GreaterThanOrEqual(left, constant),
			FilterEquations.SMALLER => Expression.LessThan(left, constant),
			FilterEquations.SMALLER_EQUALS => Expression.LessThanOrEqual(left, constant),
			FilterEquations.EMPTY => Expression.Equal(left, Expression.Constant(string.Empty)),
			FilterEquations.NOT_EMPTY => Expression.NotEqual(left, Expression.Constant(string.Empty)),
			_ => throw new NotSupportedException($"Filter equation '{eq}' is not supported for string comparisons."),
		};

		return Expression.AndAlso(notNullCheck, comparison);
	}

	#endregion

	#region DateTime Comparisons

	private static bool IsDateTimeType(Type type)
	{
		var underlyingType = Nullable.GetUnderlyingType(type) ?? type;
		return underlyingType == typeof(DateTime) || underlyingType == typeof(DateTimeOffset);
	}

	private static Expression BuildDateTimeComparisonExpression(
		Expression propertyExpression,
		JsonElement propertyValue,
		FilterEquations eq,
		Type propertyType
	)
	{
		var dateValue = TypeParser.ParseDateTime(propertyValue);
		var constantExpression = Expression.Constant(dateValue);

		var isNullable = propertyType.IsNullableType();

		Expression dateExpression;
		Expression? nullCheck = null;

		if (isNullable)
		{
			// DateTime?.HasValue
			var hasValueProperty = Expression.Property(propertyExpression, "HasValue");
			nullCheck = hasValueProperty;

			// DateTime?.Value.Date
			var valueProperty = Expression.Property(propertyExpression, "Value");
			dateExpression = Expression.Property(valueProperty, "Date");
		}
		else
		{
			// DateTime.Date
			dateExpression = Expression.Property(propertyExpression, "Date");
		}

		Expression comparison = eq switch
		{
			FilterEquations.EQUALS => Expression.Equal(dateExpression, constantExpression),
			FilterEquations.NOT_EQUALS => Expression.NotEqual(dateExpression, constantExpression),
			FilterEquations.BIGGER => Expression.GreaterThan(dateExpression, constantExpression),
			FilterEquations.BIGGER_EQUALS => Expression.GreaterThanOrEqual(dateExpression, constantExpression),
			FilterEquations.SMALLER => Expression.LessThan(dateExpression, constantExpression),
			FilterEquations.SMALLER_EQUALS => Expression.LessThanOrEqual(dateExpression, constantExpression),
			_ => throw new NotSupportedException($"Filter equation '{eq}' is not supported for DateTime comparisons."),
		};

		return nullCheck != null ? Expression.AndAlso(nullCheck, comparison) : comparison;
	}

	#endregion

	#region Number Comparisons

	private static Expression BuildNumberComparisonExpression(
		Expression propertyExpression,
		JsonElement propertyValue,
		FilterEquations eq,
		Type propertyType
	)
	{
		var isNullable = propertyType.IsNullableType();
		var underlyingType = isNullable ? Nullable.GetUnderlyingType(propertyType)! : propertyType;
		var numberValue = TypeParser.ParseNumber(propertyValue, propertyType, isNullable);
		var constantExpression = Expression.Constant(numberValue, underlyingType);

		Expression leftExpression;
		Expression? nullCheck = null;

		if (isNullable)
		{
			var hasValueProperty = Expression.Property(propertyExpression, "HasValue");
			nullCheck = hasValueProperty;
			leftExpression = Expression.Property(propertyExpression, "Value");
		}
		else
		{
			leftExpression = propertyExpression;
		}

		Expression comparison = eq switch
		{
			FilterEquations.EQUALS => Expression.Equal(leftExpression, constantExpression),
			FilterEquations.NOT_EQUALS => Expression.NotEqual(leftExpression, constantExpression),
			FilterEquations.BIGGER => Expression.GreaterThan(leftExpression, constantExpression),
			FilterEquations.BIGGER_EQUALS => Expression.GreaterThanOrEqual(leftExpression, constantExpression),
			FilterEquations.SMALLER => Expression.LessThan(leftExpression, constantExpression),
			FilterEquations.SMALLER_EQUALS => Expression.LessThanOrEqual(leftExpression, constantExpression),
			_ => throw new NotSupportedException($"Filter equation '{eq}' is not supported for number comparisons."),
		};

		return nullCheck != null ? Expression.AndAlso(nullCheck, comparison) : comparison;
	}

	#endregion

	#region Guid Comparisons

	private static Expression BuildGuidComparisonExpression(
		Expression propertyExpression,
		JsonElement propertyValue,
		FilterEquations eq,
		Type propertyType
	)
	{
		var guidValue = TypeParser.ParseGuid(propertyValue);
		var isNullable = propertyType == typeof(Guid?);

		Expression leftExpression;
		Expression? nullCheck = null;

		if (isNullable)
		{
			var hasValueProperty = Expression.Property(propertyExpression, "HasValue");
			nullCheck = hasValueProperty;
			leftExpression = Expression.Property(propertyExpression, "Value");
		}
		else
		{
			leftExpression = propertyExpression;
		}

		var constantExpression = Expression.Constant(guidValue, isNullable ? typeof(Guid) : typeof(Guid));

		Expression comparison = eq switch
		{
			FilterEquations.EQUALS => Expression.Equal(leftExpression, constantExpression),
			FilterEquations.NOT_EQUALS => Expression.NotEqual(leftExpression, constantExpression),
			FilterEquations.EMPTY => Expression.Equal(leftExpression, Expression.Constant(Guid.Empty)),
			FilterEquations.NOT_EMPTY => Expression.NotEqual(leftExpression, Expression.Constant(Guid.Empty)),
			_ => throw new NotSupportedException($"Filter equation '{eq}' is not supported for Guid comparisons."),
		};

		return nullCheck != null ? Expression.AndAlso(nullCheck, comparison) : comparison;
	}

	#endregion

	#region Other Simple Comparisons

	private static BinaryExpression BuildBoolComparisonExpression(
		Expression propertyExpression,
		JsonElement elementValue,
		FilterEquations eq
	)
	{
		var boolValue = TypeParser.ParseBool(elementValue);
		var constantExpression = Expression.Constant(boolValue);

		return eq switch
		{
			FilterEquations.EQUALS => Expression.Equal(propertyExpression, constantExpression),
			FilterEquations.NOT_EQUALS => Expression.NotEqual(propertyExpression, constantExpression),
			_ => throw new NotSupportedException($"Filter equation '{eq}' is not supported for boolean comparisons."),
		};
	}

	private static BinaryExpression BuildCharComparisonExpression(
		Expression propertyExpression,
		JsonElement elementValue,
		FilterEquations eq
	)
	{
		var charValue = TypeParser.ParseChar(elementValue);
		var constantExpression = Expression.Constant(charValue);

		return eq switch
		{
			FilterEquations.EQUALS => Expression.Equal(propertyExpression, constantExpression),
			FilterEquations.NOT_EQUALS => Expression.NotEqual(propertyExpression, constantExpression),
			FilterEquations.BIGGER => Expression.GreaterThan(propertyExpression, constantExpression),
			FilterEquations.BIGGER_EQUALS => Expression.GreaterThanOrEqual(propertyExpression, constantExpression),
			FilterEquations.SMALLER => Expression.LessThan(propertyExpression, constantExpression),
			FilterEquations.SMALLER_EQUALS => Expression.LessThanOrEqual(propertyExpression, constantExpression),
			_ => throw new NotSupportedException($"Filter equation '{eq}' is not supported for char comparisons."),
		};
	}

	private static Expression BuildEnumComparisonExpression(
		Expression propertyExpression,
		JsonElement enumValue,
		FilterEquations eq,
		Type enumType
	)
	{
		var isNullable = enumType.IsNullableType();
		var underlyingType = isNullable ? Nullable.GetUnderlyingType(enumType)! : enumType;
		var enumConstant = TypeParser.ParseEnum(enumValue, underlyingType);
		var constantExpression = Expression.Constant(enumConstant, underlyingType);

		Expression leftExpression;
		Expression? nullCheck = null;

		if (isNullable)
		{
			var hasValueProperty = Expression.Property(propertyExpression, "HasValue");
			nullCheck = hasValueProperty;
			leftExpression = Expression.Property(propertyExpression, "Value");
		}
		else
		{
			leftExpression = propertyExpression;
		}

		Expression comparison = eq switch
		{
			FilterEquations.EQUALS => Expression.Equal(leftExpression, constantExpression),
			FilterEquations.NOT_EQUALS => Expression.NotEqual(leftExpression, constantExpression),
			FilterEquations.BIGGER => Expression.GreaterThan(leftExpression, constantExpression),
			FilterEquations.BIGGER_EQUALS => Expression.GreaterThanOrEqual(leftExpression, constantExpression),
			FilterEquations.SMALLER => Expression.LessThan(leftExpression, constantExpression),
			FilterEquations.SMALLER_EQUALS => Expression.LessThanOrEqual(leftExpression, constantExpression),
			_ => throw new NotSupportedException($"Filter equation '{eq}' is not supported for enum comparisons."),
		};

		return nullCheck != null ? Expression.AndAlso(nullCheck, comparison) : comparison;
	}

	#endregion

	#region Array and Collection Comparisons

	private static MethodCallExpression BuildArrayComparisonExpression(
		Expression propertyExpression,
		JsonElement propertyValue,
		Type propertyType
	)
	{
		var values = TypeParser.ParseList(propertyValue, propertyType);

		var containsMethod = GetEnumerableContainsMethod(propertyType);

		return Expression.Call(containsMethod, Expression.Constant(values), propertyExpression);
	}

	private static Expression? BuildCollectionPropertyComparisonExpression(
		PropertyInfo propertyInfo,
		JsonElement propertyValue,
		FilterEquations eq,
		Expression propertyExpression
	)
	{
		var elementType = GetCollectionElementType(propertyInfo.PropertyType);
		if (elementType == null)
			return null;

		// Single value in collection: collection.Contains(value)
		if (propertyValue.ValueKind != JsonValueKind.Array)
		{
			var convertedValue = ConvertJsonElementToType(propertyValue, elementType);
			var constantExpression = Expression.Constant(convertedValue, elementType);
			var containsMethod = GetEnumerableContainsMethod(elementType);

			return eq switch
			{
				FilterEquations.CONTAINS => Expression.Call(null, containsMethod, propertyExpression, constantExpression),
				FilterEquations.NOT_EQUALS => Expression.Not(Expression.Call(null, containsMethod, propertyExpression, constantExpression)),
				_ => throw new NotSupportedException($"Filter equation '{eq}' is not supported for collection property comparisons."),
			};
		}

		// Array of values: collection.Intersect(values).Any()
		var values = TypeParser.ParseList(propertyValue, elementType);
		var intersectMethod = GetEnumerableIntersectMethod(elementType);
		var anyMethod = GetEnumerableAnyMethod(elementType);

		var intersectCall = Expression.Call(null, intersectMethod, propertyExpression, Expression.Constant(values));

		return eq switch
		{
			FilterEquations.CONTAINS => Expression.Call(null, anyMethod, intersectCall),
			FilterEquations.NOT_EQUALS => Expression.Not(Expression.Call(null, anyMethod, intersectCall)),
			_ => throw new NotSupportedException($"Filter equation '{eq}' is not supported for collection property comparisons."),
		};
	}

	#endregion

	#region Helper Methods

	private static bool IsCollectionType(Type type)
	{
		if (type == typeof(string))
			return false;

		if (type.IsArray)
			return true;

		return type.IsGenericType
			&& type.GetInterfaces().Any(i => i.IsGenericType && i.GetGenericTypeDefinition() == typeof(IEnumerable<>));
	}

	private static Type? GetCollectionElementType(Type collectionType)
	{
		if (collectionType.IsArray)
			return collectionType.GetElementType();

		if (collectionType.IsGenericType)
		{
			var enumerableInterface = collectionType
				.GetInterfaces()
				.FirstOrDefault(i => i.IsGenericType && i.GetGenericTypeDefinition() == typeof(IEnumerable<>));

			return enumerableInterface?.GetGenericArguments()[0];
		}

		return null;
	}

	private static object ConvertJsonElementToType(JsonElement element, Type targetType)
	{
		return targetType switch
		{
			Type t when t == typeof(int) => element.GetInt32(),
			Type t when t == typeof(double) => element.GetDouble(),
			Type t when t == typeof(decimal) => element.GetDecimal(),
			Type t when t == typeof(long) => element.GetInt64(),
			Type t when t == typeof(short) => element.GetInt16(),
			Type t when t == typeof(float) => element.GetSingle(),
			Type t when t == typeof(byte) => element.GetByte(),
			Type t when t == typeof(string) => element.GetString()!,
			Type t when t == typeof(DateTime) || t == typeof(DateTimeOffset) => TypeParser.ParseDateTime(element),
			Type t when t == typeof(Guid) => TypeParser.ParseGuid(element),
			Type t when t == typeof(bool) => TypeParser.ParseBool(element),
			Type t when t == typeof(char) => TypeParser.ParseChar(element),
			Type t when t.IsEnum => TypeParser.ParseEnum(element, t),
			_ => throw new NotSupportedException($"Unsupported element type: {targetType.Name}"),
		};
	}

	private static MethodInfo GetEnumerableContainsMethod(Type elementType)
	{
		return EnumerableContainsMethods.GetOrAdd(
			elementType,
			t =>
			{
				var method = typeof(Enumerable)
					.GetMethods(BindingFlags.Static | BindingFlags.Public)
					.FirstOrDefault(m => m.Name == nameof(Enumerable.Contains) && m.GetParameters().Length == 2);

				return method?.MakeGenericMethod(t) ?? throw new InvalidOperationException($"Contains method not found for type {t.Name}");
			}
		);
	}

	private static MethodInfo GetEnumerableIntersectMethod(Type elementType)
	{
		return EnumerableIntersectMethods.GetOrAdd(
			elementType,
			t =>
			{
				var method = typeof(Enumerable)
					.GetMethods(BindingFlags.Static | BindingFlags.Public)
					.FirstOrDefault(m => m.Name == nameof(Enumerable.Intersect) && m.GetParameters().Length == 2);

				return method?.MakeGenericMethod(t) ?? throw new InvalidOperationException($"Intersect method not found for type {t.Name}");
			}
		);
	}

	private static MethodInfo GetEnumerableAnyMethod(Type elementType)
	{
		return EnumerableAnyMethods.GetOrAdd(
			elementType,
			t =>
			{
				var method = typeof(Enumerable)
					.GetMethods(BindingFlags.Static | BindingFlags.Public)
					.FirstOrDefault(m => m.Name == nameof(Enumerable.Any) && m.GetParameters().Length == 1);

				return method?.MakeGenericMethod(t) ?? throw new InvalidOperationException($"Any method not found for type {t.Name}");
			}
		);
	}

	#endregion
}
