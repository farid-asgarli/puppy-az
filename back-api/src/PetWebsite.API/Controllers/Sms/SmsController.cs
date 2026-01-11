using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using PetWebsite.API.Controllers.Base;
using PetWebsite.API.Extensions;
using PetWebsite.Application.Features.Sms.Commands.SendSms;
using PetWebsite.Application.Features.Sms.Queries.CheckSmsBalance;

namespace PetWebsite.API.Controllers.Sms;

/// <summary>
/// Controller for SMS operations.
/// </summary>
[Authorize]
[ApiController]
[Route("api/sms")]
[Produces("application/json")]
public class SmsController(IMediator mediator, IStringLocalizer<SmsController> localizer) : BaseApiController(mediator, localizer)
{
	/// <summary>
	/// Send an SMS message to a phone number.
	/// </summary>
	/// <param name="command">SMS details including phone number and message</param>
	/// <param name="cancellationToken">Cancellation token</param>
	/// <returns>Result indicating success or failure</returns>
	[HttpPost("send")]
	[ProducesResponseType(StatusCodes.Status200OK)]
	[ProducesResponseType(StatusCodes.Status400BadRequest)]
	[ProducesResponseType(StatusCodes.Status401Unauthorized)]
	public async Task<IActionResult> SendSms(SendSmsCommand command, CancellationToken cancellationToken)
	{
		var result = await Mediator.Send(command, cancellationToken);
		return result.ToActionResult();
	}

	/// <summary>
	/// Check the current SMS balance from the provider.
	/// </summary>
	/// <param name="cancellationToken">Cancellation token</param>
	/// <returns>The current SMS balance amount</returns>
	[HttpGet("balance")]
	[ProducesResponseType(typeof(decimal), StatusCodes.Status200OK)]
	[ProducesResponseType(StatusCodes.Status401Unauthorized)]
	[ProducesResponseType(StatusCodes.Status500InternalServerError)]
	public async Task<IActionResult> CheckBalance(CancellationToken cancellationToken)
	{
		var query = new CheckSmsBalanceQuery();
		var result = await Mediator.Send(query, cancellationToken);
		return result.ToActionResult();
	}
}
