using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using PetWebsite.API.Constants;
using PetWebsite.API.Controllers.Base;
using PetWebsite.API.Extensions;
using PetWebsite.Application.Features.Admin.PetAds.Commands.ReviewPetAd;
using PetWebsite.Application.Features.Admin.PetAds.Commands.SetPetAdPremium;

namespace PetWebsite.API.Controllers.Admin;

/// <summary>
/// Controller for managing pet advertisements (admin only).
/// </summary>
[Authorize(Roles = AuthorizationConstants.Roles.Admin)]
public class PetAdsController(IMediator mediator, IStringLocalizer<PetAdsController> localizer) : AdminBaseController(mediator, localizer)
{
	/// <summary>
	/// Review a pet advertisement (approve or reject).
	/// </summary>
	/// <param name="id">Pet ad ID</param>
	/// <param name="command">Review decision with optional rejection reason</param>
	/// <param name="cancellationToken">Cancellation token</param>
	/// <returns>No content on success</returns>
	/// <response code="204">Pet ad reviewed successfully</response>
	/// <response code="400">Invalid request or ad cannot be reviewed</response>
	/// <response code="404">Pet ad not found</response>
	[HttpPost("{id:int}/review")]
	[ProducesResponseType(StatusCodes.Status204NoContent)]
	[ProducesResponseType(StatusCodes.Status400BadRequest)]
	[ProducesResponseType(StatusCodes.Status404NotFound)]
	public async Task<IActionResult> ReviewPetAd(int id, ReviewPetAdCommand command, CancellationToken cancellationToken)
	{
		if (id != command.Id)
			return BadRequest("ID mismatch");

		var result = await Mediator.Send(command, cancellationToken);

		if (result.IsSuccess)
			return NoContent();

		return result.ToActionResult();
	}

	/// <summary>
	/// Set or remove premium status for a pet advertisement.
	/// </summary>
	/// <param name="id">Pet ad ID</param>
	/// <param name="command">Premium status configuration</param>
	/// <param name="cancellationToken">Cancellation token</param>
	/// <returns>No content on success</returns>
	/// <response code="204">Premium status updated successfully</response>
	/// <response code="400">Invalid request</response>
	/// <response code="404">Pet ad not found</response>
	[HttpPost("{id:int}/premium")]
	[ProducesResponseType(StatusCodes.Status204NoContent)]
	[ProducesResponseType(StatusCodes.Status400BadRequest)]
	[ProducesResponseType(StatusCodes.Status404NotFound)]
	public async Task<IActionResult> SetPremiumStatus(int id, SetPetAdPremiumCommand command, CancellationToken cancellationToken)
	{
		if (id != command.Id)
			return BadRequest("ID mismatch");

		var result = await Mediator.Send(command, cancellationToken);

		if (result.IsSuccess)
			return NoContent();

		return result.ToActionResult();
	}
}
