namespace Common.Repository.Extensions;

public static class StringExtensions
{
    public static string ConvertCamelCaseToPascalCase(this string input)
    {
        if (string.IsNullOrEmpty(input))
            return input;

        string[] parts = input.Split(':');
        for (int i = 0; i < parts.Length; i++)
        {
            if (parts[i].Length > 0)
            {
                parts[i] = char.ToUpperInvariant(parts[i][0]) + parts[i][1..];
            }
        }

        return string.Join(':', parts);
    }

    public static string ConvertPascalToCamelCase(this string input)
    {
        if (string.IsNullOrEmpty(input))
            return input;

        return char.ToLowerInvariant(input[0]) + input.Substring(1);
    }
}
