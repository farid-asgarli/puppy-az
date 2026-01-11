using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using PetWebsite.API.Controllers.Base;
using PetWebsite.Domain.Constants;

namespace PetWebsite.API.Controllers.Testing;

/// <summary>
/// Controller for testing localization functionality.
/// This should be removed or disabled in production environments.
/// </summary>
#if DEBUG
public class LocalizationTestController(IMediator mediator, IStringLocalizer<LocalizationTestController> localizer)
	: BaseApiController(mediator, localizer)
{
	/// <summary>
	/// Test endpoint to demonstrate localization.
	/// Use query parameter: ?culture=ru or ?culture=az or ?culture=en
	/// Or set Accept-Language header
	/// </summary>
	[HttpGet("test")]
	public IActionResult TestLocalization()
	{
		return Ok(
			new
			{
				emailRequired = Localizer[LocalizationKeys.Auth.EmailRequired].Value,
				passwordRequired = Localizer[LocalizationKeys.Auth.PasswordRequired].Value,
				userNotFound = Localizer[LocalizationKeys.User.NotFound].Value,
				loginSuccess = Localizer[LocalizationKeys.Auth.LoginSuccess].Value,
				withParameters = Localizer[LocalizationKeys.Auth.PasswordTooShort, 8].Value,
				currentCulture = System.Globalization.CultureInfo.CurrentCulture.Name,
				currentUICulture = System.Globalization.CultureInfo.CurrentUICulture.Name,
			}
		);
	}
}
#endif
