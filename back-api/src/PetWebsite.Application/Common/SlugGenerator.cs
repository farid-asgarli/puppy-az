using System.Text;
using System.Text.RegularExpressions;

namespace PetWebsite.Application.Common;

/// <summary>
/// Generates URL-friendly slugs from titles.
/// Handles Azerbaijani, English and Russian characters.
/// </summary>
public static partial class SlugGenerator
{
	private static readonly Dictionary<char, string> AzMappings = new()
	{
		{ 'ə', "e" },
		{ 'Ə', "e" },
		{ 'ü', "u" },
		{ 'Ü', "u" },
		{ 'ö', "o" },
		{ 'Ö', "o" },
		{ 'ğ', "g" },
		{ 'Ğ', "g" },
		{ 'ı', "i" },
		{ 'İ', "i" },
		{ 'ç', "c" },
		{ 'Ç', "c" },
		{ 'ş', "s" },
		{ 'Ş', "s" },
	};

	private static readonly Dictionary<char, string> RuMappings = new()
	{
		{ 'а', "a" },
		{ 'б', "b" },
		{ 'в', "v" },
		{ 'г', "g" },
		{ 'д', "d" },
		{ 'е', "e" },
		{ 'ё', "yo" },
		{ 'ж', "zh" },
		{ 'з', "z" },
		{ 'и', "i" },
		{ 'й', "y" },
		{ 'к', "k" },
		{ 'л', "l" },
		{ 'м', "m" },
		{ 'н', "n" },
		{ 'о', "o" },
		{ 'п', "p" },
		{ 'р', "r" },
		{ 'с', "s" },
		{ 'т', "t" },
		{ 'у', "u" },
		{ 'ф', "f" },
		{ 'х', "kh" },
		{ 'ц', "ts" },
		{ 'ч', "ch" },
		{ 'ш', "sh" },
		{ 'щ', "shch" },
		{ 'ъ', "" },
		{ 'ы', "y" },
		{ 'ь', "" },
		{ 'э', "e" },
		{ 'ю', "yu" },
		{ 'я', "ya" },
		{ 'А', "a" },
		{ 'Б', "b" },
		{ 'В', "v" },
		{ 'Г', "g" },
		{ 'Д', "d" },
		{ 'Е', "e" },
		{ 'Ё', "yo" },
		{ 'Ж', "zh" },
		{ 'З', "z" },
		{ 'И', "i" },
		{ 'Й', "y" },
		{ 'К', "k" },
		{ 'Л', "l" },
		{ 'М', "m" },
		{ 'Н', "n" },
		{ 'О', "o" },
		{ 'П', "p" },
		{ 'Р', "r" },
		{ 'С', "s" },
		{ 'Т', "t" },
		{ 'У', "u" },
		{ 'Ф', "f" },
		{ 'Х', "kh" },
		{ 'Ц', "ts" },
		{ 'Ч', "ch" },
		{ 'Ш', "sh" },
		{ 'Щ', "shch" },
		{ 'Ъ', "" },
		{ 'Ы', "y" },
		{ 'Ь', "" },
		{ 'Э', "e" },
		{ 'Ю', "yu" },
		{ 'Я', "ya" },
	};

	/// <summary>
	/// Converts a title string to a URL-friendly slug.
	/// </summary>
	public static string Slugify(string text)
	{
		if (string.IsNullOrWhiteSpace(text))
			return string.Empty;

		var sb = new StringBuilder(text.Length);
		foreach (var c in text)
		{
			if (AzMappings.TryGetValue(c, out var azReplacement))
				sb.Append(azReplacement);
			else if (RuMappings.TryGetValue(c, out var ruReplacement))
				sb.Append(ruReplacement);
			else
				sb.Append(c);
		}

		var result = sb.ToString().ToLowerInvariant();

		// Normalize unicode and remove diacritics
		result = result.Normalize(NormalizationForm.FormD);
		result = NonAsciiLetterRegex().Replace(result, "");

		// Replace non-alphanumeric with hyphens
		result = NonAlphanumericRegex().Replace(result, "-");

		// Remove consecutive hyphens
		result = ConsecutiveHyphensRegex().Replace(result, "-");

		// Trim hyphens
		result = result.Trim('-');

		return result;
	}

	[GeneratedRegex(@"[\p{Mn}]")]
	private static partial Regex NonAsciiLetterRegex();

	[GeneratedRegex(@"[^a-z0-9]+")]
	private static partial Regex NonAlphanumericRegex();

	[GeneratedRegex(@"-{2,}")]
	private static partial Regex ConsecutiveHyphensRegex();
}
