namespace Common.Repository.Extensions;

public static class TypeExtensions
{
    public static bool IsNullableType(this Type type)
    {
        if (type.IsValueType)
            return type.IsNullableValueType();

        return true;
    }

    public static bool IsNullableValueType(this Type type)
    {
        if (type.IsConstructedGenericType)
            return type.GetGenericTypeDefinition() == typeof(Nullable<>);

        return false;
    }
}
