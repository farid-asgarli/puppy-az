using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;

namespace PetWebsite.Infrastructure.Localization;

/// <summary>
/// Factory for creating JSON-based string localizers.
/// </summary>
public class JsonStringLocalizerFactory(string resourcesPath, ILoggerFactory loggerFactory) : IStringLocalizerFactory
{
	private readonly string _resourcesPath = resourcesPath;
	private readonly ILoggerFactory _loggerFactory = loggerFactory;

	public IStringLocalizer Create(Type resourceSource)
	{
		var logger = _loggerFactory.CreateLogger<JsonStringLocalizer>();
		return new JsonStringLocalizer(_resourcesPath, logger);
	}

	public IStringLocalizer Create(string baseName, string location)
	{
		var logger = _loggerFactory.CreateLogger<JsonStringLocalizer>();
		return new JsonStringLocalizer(_resourcesPath, logger);
	}
}
