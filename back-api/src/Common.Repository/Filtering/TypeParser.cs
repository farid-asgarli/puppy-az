using System.Collections.Concurrent;
using System.Globalization;
using System.Reflection;
using System.Text.Json;

namespace Common.Repository.Filtering;

public static class TypeParser
{
	private static readonly ConcurrentDictionary<Type, MethodInfo> EnumListParsers = new();

	#region Parse Numbers

	public static object ParseNumber(JsonElement propertyValue, Type targetType, bool isNullable = false)
	{
		var underlyingType = isNullable ? Nullable.GetUnderlyingType(targetType) ?? targetType : targetType;

		if (propertyValue.ValueKind == JsonValueKind.String)
		{
			var stringValue = propertyValue.GetString();
			if (string.IsNullOrWhiteSpace(stringValue))
				throw new ArgumentException("String value cannot be null or empty for numeric conversion.");

			return Convert.ChangeType(stringValue, underlyingType, CultureInfo.InvariantCulture)!;
		}

		return underlyingType switch
		{
			Type t when t == typeof(int) => propertyValue.GetInt32(),
			Type t when t == typeof(double) => propertyValue.GetDouble(),
			Type t when t == typeof(decimal) => propertyValue.GetDecimal(),
			Type t when t == typeof(long) => propertyValue.GetInt64(),
			Type t when t == typeof(short) => propertyValue.GetInt16(),
			Type t when t == typeof(float) => propertyValue.GetSingle(),
			Type t when t == typeof(byte) => propertyValue.GetByte(),
			Type t when t == typeof(uint) => propertyValue.GetUInt32(),
			Type t when t == typeof(ulong) => propertyValue.GetUInt64(),
			Type t when t == typeof(ushort) => propertyValue.GetUInt16(),
			Type t when t == typeof(sbyte) => propertyValue.GetSByte(),
			_ => throw new NotSupportedException($"The type '{underlyingType.Name}' is not a supported numeric type."),
		};
	}

	#endregion

	#region Parse Simple Types

	public static Guid ParseGuid(JsonElement propertyValue)
	{
		var stringValue = propertyValue.GetString();

		if (string.IsNullOrWhiteSpace(stringValue))
			throw new ArgumentException("GUID string cannot be null or empty.");

		if (!Guid.TryParse(stringValue, out var guidValue))
			throw new FormatException($"Unable to parse '{stringValue}' as GUID.");

		return guidValue;
	}

	public static bool TryParseGuid(JsonElement propertyValue, out Guid result)
	{
		var stringValue = propertyValue.GetString();
		return Guid.TryParse(stringValue, out result);
	}

	public static char ParseChar(JsonElement propertyValue)
	{
		var stringValue = propertyValue.GetString();

		if (string.IsNullOrEmpty(stringValue) || stringValue.Length != 1)
			throw new ArgumentException("Value must be a single character string.");

		return stringValue[0];
	}

	public static bool ParseBool(JsonElement propertyValue)
	{
		return propertyValue.ValueKind switch
		{
			JsonValueKind.True => true,
			JsonValueKind.False => false,
			_ => throw new ArgumentException($"Expected boolean value, got {propertyValue.ValueKind}."),
		};
	}

	public static DateTime ParseDateTime(JsonElement propertyValue)
	{
		if (propertyValue.ValueKind == JsonValueKind.String)
		{
			var stringValue = propertyValue.GetString();

			if (string.IsNullOrWhiteSpace(stringValue))
				throw new ArgumentException("DateTime string cannot be null or empty.");

			if (!DateTime.TryParse(stringValue, CultureInfo.InvariantCulture, DateTimeStyles.None, out var dateTime))
				throw new FormatException($"Unable to parse '{stringValue}' as DateTime.");

			return dateTime.Date;
		}

		return propertyValue.GetDateTime().Date;
	}

	public static bool TryParseDateTime(JsonElement propertyValue, out DateTime result)
	{
		if (propertyValue.ValueKind == JsonValueKind.String)
		{
			var stringValue = propertyValue.GetString();
			if (DateTime.TryParse(stringValue, CultureInfo.InvariantCulture, DateTimeStyles.None, out result))
			{
				result = result.Date;
				return true;
			}
			return false;
		}

		try
		{
			result = propertyValue.GetDateTime().Date;
			return true;
		}
		catch
		{
			result = default;
			return false;
		}
	}

	public static object ParseEnum(JsonElement element, Type enumType)
	{
		if (!enumType.IsEnum)
			throw new ArgumentException($"Type {enumType.Name} is not an enum.", nameof(enumType));

		var value = element.GetInt32();

		// !TODO: Validate enum value
		// if (!Enum.IsDefined(enumType, value))
		//     throw new ArgumentException($"Value {value} is not defined in enum {enumType.Name}.");

		return Enum.ToObject(enumType, value);
	}

	#endregion

	#region Parse Lists

	public static List<bool> ParseBoolList(JsonElement propertyValue)
	{
		var result = new List<bool>();
		foreach (var element in propertyValue.EnumerateArray())
		{
			result.Add(ParseBool(element));
		}
		return result;
	}

	public static List<char> ParseCharList(JsonElement propertyValue)
	{
		var result = new List<char>();
		foreach (var element in propertyValue.EnumerateArray())
		{
			result.Add(ParseChar(element));
		}
		return result;
	}

	public static List<int> ParseIntList(JsonElement propertyValue) => [.. propertyValue.EnumerateArray().Select(e => e.GetInt32())];

	public static List<long> ParseLongList(JsonElement propertyValue) => [.. propertyValue.EnumerateArray().Select(e => e.GetInt64())];

	public static List<short> ParseShortList(JsonElement propertyValue) => [.. propertyValue.EnumerateArray().Select(e => e.GetInt16())];

	public static List<decimal> ParseDecimalList(JsonElement propertyValue) =>
		[.. propertyValue.EnumerateArray().Select(e => e.GetDecimal())];

	public static List<double> ParseDoubleList(JsonElement propertyValue) => [.. propertyValue.EnumerateArray().Select(e => e.GetDouble())];

	public static List<float> ParseFloatList(JsonElement propertyValue) => [.. propertyValue.EnumerateArray().Select(e => e.GetSingle())];

	public static List<byte> ParseByteList(JsonElement propertyValue) => [.. propertyValue.EnumerateArray().Select(e => e.GetByte())];

	public static List<uint> ParseUIntList(JsonElement propertyValue) => [.. propertyValue.EnumerateArray().Select(e => e.GetUInt32())];

	public static List<ulong> ParseULongList(JsonElement propertyValue) => [.. propertyValue.EnumerateArray().Select(e => e.GetUInt64())];

	public static List<ushort> ParseUShortList(JsonElement propertyValue) => [.. propertyValue.EnumerateArray().Select(e => e.GetUInt16())];

	public static List<sbyte> ParseSByteList(JsonElement propertyValue) => [.. propertyValue.EnumerateArray().Select(e => e.GetSByte())];

	public static List<DateTime> ParseDateTimeList(JsonElement propertyValue)
	{
		var result = new List<DateTime>();
		foreach (var element in propertyValue.EnumerateArray())
		{
			result.Add(ParseDateTime(element));
		}
		return result;
	}

	public static List<Guid> ParseGuidList(JsonElement propertyValue)
	{
		var result = new List<Guid>();
		foreach (var element in propertyValue.EnumerateArray())
		{
			result.Add(ParseGuid(element));
		}
		return result;
	}

	public static List<string> ParseStringList(JsonElement propertyValue, bool allowNulls = false)
	{
		var result = new List<string>();
		foreach (var element in propertyValue.EnumerateArray())
		{
			var value = element.GetString();
			if (value == null && !allowNulls)
				throw new ArgumentException("Array contains null string value.");

			result.Add(value ?? string.Empty);
		}
		return result;
	}

	public static List<TEnum> ParseEnumList<TEnum>(JsonElement propertyValue)
		where TEnum : struct, Enum
	{
		var result = new List<TEnum>();
		foreach (var element in propertyValue.EnumerateArray())
		{
			var value = (TEnum)ParseEnum(element, typeof(TEnum));
			result.Add(value);
		}
		return result;
	}

	#endregion

	#region Parse List (Generic)

	public static object ParseList(JsonElement propertyValue, Type elementType)
	{
		return elementType switch
		{
			Type t when t == typeof(int) => ParseIntList(propertyValue),
			Type t when t == typeof(long) => ParseLongList(propertyValue),
			Type t when t == typeof(short) => ParseShortList(propertyValue),
			Type t when t == typeof(double) => ParseDoubleList(propertyValue),
			Type t when t == typeof(decimal) => ParseDecimalList(propertyValue),
			Type t when t == typeof(float) => ParseFloatList(propertyValue),
			Type t when t == typeof(byte) => ParseByteList(propertyValue),
			Type t when t == typeof(uint) => ParseUIntList(propertyValue),
			Type t when t == typeof(ulong) => ParseULongList(propertyValue),
			Type t when t == typeof(ushort) => ParseUShortList(propertyValue),
			Type t when t == typeof(sbyte) => ParseSByteList(propertyValue),
			Type t when t == typeof(string) => ParseStringList(propertyValue),
			Type t when t == typeof(bool) => ParseBoolList(propertyValue),
			Type t when t == typeof(char) => ParseCharList(propertyValue),
			Type t when t == typeof(Guid) => ParseGuidList(propertyValue),
			Type t when t == typeof(DateTime) || t == typeof(DateTimeOffset) => ParseDateTimeList(propertyValue),
			Type t when t.IsEnum => InvokeParseEnumList(t, propertyValue),
			_ => throw new NotSupportedException($"Unsupported array element type: {elementType.Name}."),
		};
	}

	#endregion

	#region Private Helpers

	private static object InvokeParseEnumList(Type enumType, JsonElement propertyValue)
	{
		var method = EnumListParsers.GetOrAdd(
			enumType,
			t =>
			{
				var parseMethod = typeof(TypeParser).GetMethod(nameof(ParseEnumList), BindingFlags.Public | BindingFlags.Static);

				if (parseMethod == null)
					throw new InvalidOperationException("ParseEnumList method not found.");

				return parseMethod.MakeGenericMethod(t);
			}
		);

		return (System.Collections.IList)method.Invoke(null, [propertyValue])!;
	}

	#endregion
}
