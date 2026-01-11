using FluentValidation;
using Microsoft.Extensions.Localization;

namespace PetWebsite.Application.Common.Validators;

/// <summary>
/// Base validator class that provides localization support for all validators.
/// Eliminates duplication and ensures consistent localization patterns across all validators.
/// </summary>
/// <typeparam name="T">The type being validated.</typeparam>
public abstract class BaseValidator<T>(IStringLocalizer localizer) : AbstractValidator<T>
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
