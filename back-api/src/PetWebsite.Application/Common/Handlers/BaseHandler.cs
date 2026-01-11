using Microsoft.Extensions.Localization;

namespace PetWebsite.Application.Common.Handlers;

/// <summary>
/// Base handler with localization support.
/// </summary>
public abstract class BaseHandler(IStringLocalizer localizer)
{
	protected readonly IStringLocalizer Localizer = localizer;

	/// <summary>
	/// Gets a localized string by key.
	/// </summary>
	protected string L(string key) => Localizer[key].Value;

	/// <summary>
	/// Gets a localized string with parameters.
	/// </summary>
	protected string L(string key, params object[] args) => Localizer[key, args].Value;
}
