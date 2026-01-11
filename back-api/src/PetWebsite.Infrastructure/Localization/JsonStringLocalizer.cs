using System.Globalization;
using System.Text.Json;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;

namespace PetWebsite.Infrastructure.Localization;

/// <summary>
/// JSON-based string localizer implementation.
/// </summary>
public class JsonStringLocalizer : IStringLocalizer
{
	private readonly Dictionary<string, Dictionary<string, string>> _localizations = [];
	private readonly string _resourcesPath;
	private readonly ILogger<JsonStringLocalizer> _logger;

	public JsonStringLocalizer(string resourcesPath, ILogger<JsonStringLocalizer> logger)
	{
		_resourcesPath = resourcesPath;
		_logger = logger;
		LoadLocalizations();
	}

	public LocalizedString this[string name]
	{
		get
		{
			var culture = CultureInfo.CurrentCulture.Name;
			var value = GetString(name, culture);
			return new LocalizedString(name, value ?? name, value == null);
		}
	}

	public LocalizedString this[string name, params object[] arguments]
	{
		get
		{
			var culture = CultureInfo.CurrentCulture.Name;
			var format = GetString(name, culture);

			if (format == null)
			{
				return new LocalizedString(name, name, true);
			}

			var value = string.Format(format, arguments);
			return new LocalizedString(name, value, false);
		}
	}

	public IEnumerable<LocalizedString> GetAllStrings(bool includeParentCultures)
	{
		var culture = CultureInfo.CurrentCulture.Name;

		if (_localizations.TryGetValue(culture, out var strings))
		{
			foreach (var item in strings)
			{
				yield return new LocalizedString(item.Key, item.Value, false);
			}
		}

		if (includeParentCultures && culture.Contains('-'))
		{
			var parentCulture = culture.Split('-')[0];
			if (_localizations.TryGetValue(parentCulture, out var parentStrings))
			{
				foreach (var item in parentStrings)
				{
					yield return new LocalizedString(item.Key, item.Value, false);
				}
			}
		}
	}

	private string? GetString(string name, string culture)
	{
		// Try exact culture match
		if (_localizations.TryGetValue(culture, out var strings) && strings.TryGetValue(name, out var value))
		{
			return value;
		}

		// Try parent culture (e.g., "en" for "en-US")
		if (culture.Contains('-'))
		{
			var parentCulture = culture.Split('-')[0];
			if (_localizations.TryGetValue(parentCulture, out var parentStrings) && parentStrings.TryGetValue(name, out var parentValue))
			{
				return parentValue;
			}
		}

		// Try default culture (en)
		if (_localizations.TryGetValue("en", out var defaultStrings) && defaultStrings.TryGetValue(name, out var defaultValue))
		{
			return defaultValue;
		}

		return null;
	}

	private void LoadLocalizations()
	{
		try
		{
			if (!Directory.Exists(_resourcesPath))
			{
				_logger.LogWarning("Localization resources path does not exist: {Path}", _resourcesPath);
				return;
			}

			var jsonFiles = Directory.GetFiles(_resourcesPath, "*.json");

			foreach (var file in jsonFiles)
			{
				var culture = Path.GetFileNameWithoutExtension(file);
				var json = File.ReadAllText(file);
				var dictionary = JsonSerializer.Deserialize<Dictionary<string, string>>(json);

				if (dictionary != null)
				{
					_localizations[culture] = dictionary;
					_logger.LogInformation("Loaded localization for culture: {Culture}", culture);
				}
			}
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, "Error loading localizations from {Path}", _resourcesPath);
		}
	}
}
