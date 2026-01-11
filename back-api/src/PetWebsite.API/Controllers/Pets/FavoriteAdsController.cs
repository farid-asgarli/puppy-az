using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using PetWebsite.API.Controllers.Base;
using PetWebsite.API.Extensions;
using PetWebsite.Application.Common.Models;
using PetWebsite.Application.Features.FavoriteAds.Commands.AddFavoriteAd;
using PetWebsite.Application.Features.FavoriteAds.Commands.RemoveFavoriteAd;
using PetWebsite.Application.Features.FavoriteAds.Queries.GetUserFavoriteAds;
using PetWebsite.Application.Features.PetAds;
using PetWebsite.Domain.Constants;

namespace PetWebsite.API.Controllers.Pets;

/// <summary>
/// Controller for favorite pet advertisement operations.
/// </summary>
[Authorize]
public class FavoriteAdsController(IMediator mediator, IStringLocalizer<FavoriteAdsController> localizer)
	: BaseApiController(mediator, localizer)
{
	/// <summary>
	/// Add pet ads to the user's favorites.
	/// </summary>
	/// <param name="petAdIds">List of pet ad IDs to add to favorites</param>
	/// <param name="cancellationToken">Cancellation token</param>
	/// <returns>Success response</returns>
	/// <response code="201">Ads added to favorites successfully</response>
	/// <response code="400">Ads are already in favorites or invalid data</response>
	/// <response code="401">User is not authenticated</response>
	/// <response code="404">Pet ads not found</response>
	[HttpPost]
	[ProducesResponseType(StatusCodes.Status201Created)]
	[ProducesResponseType(StatusCodes.Status400BadRequest)]
	[ProducesResponseType(StatusCodes.Status401Unauthorized)]
	[ProducesResponseType(StatusCodes.Status404NotFound)]
	public async Task<IActionResult> AddFavoriteAd([FromBody] List<int> petAdIds, CancellationToken cancellationToken)
	{
		var result = await Mediator.Send(new AddFavoriteAdCommand(petAdIds), cancellationToken);

		if (result.IsSuccess)
		{
			return StatusCode(StatusCodes.Status201Created, new { message = Localizer[LocalizationKeys.FavoriteAd.AddSuccess] });
		}

		return result.ToActionResult();
	}

	/// <summary>
	/// Remove a pet ad from the user's favorites.
	/// </summary>
	/// <param name="petAdId">Pet ad ID to remove from favorites</param>
	/// <param name="cancellationToken">Cancellation token</param>
	/// <returns>Success response</returns>
	/// <response code="200">Ad removed from favorites successfully</response>
	/// <response code="401">User is not authenticated</response>
	/// <response code="404">Favorite ad not found</response>
	[HttpDelete("{petAdId:int}")]
	[ProducesResponseType(StatusCodes.Status200OK)]
	[ProducesResponseType(StatusCodes.Status401Unauthorized)]
	[ProducesResponseType(StatusCodes.Status404NotFound)]
	public async Task<IActionResult> RemoveFavoriteAd(int petAdId, CancellationToken cancellationToken)
	{
		var result = await Mediator.Send(new RemoveFavoriteAdCommand(petAdId), cancellationToken);

		if (result.IsSuccess)
		{
			return Ok(new { message = Localizer[LocalizationKeys.FavoriteAd.RemoveSuccess] });
		}

		return result.ToActionResult();
	}

	/// <summary>
	/// Get the user's favorite pet ads with pagination.
	/// </summary>
	/// <param name="pageNumber">Page number (default: 1)</param>
	/// <param name="pageSize">Page size (default: 10)</param>
	/// <param name="cancellationToken">Cancellation token</param>
	/// <returns>Paginated list of favorite pet ads</returns>
	/// <response code="200">Returns the list of favorite ads</response>
	/// <response code="401">User is not authenticated</response>
	[HttpPost("list")]
	[ProducesResponseType(typeof(PaginatedResult<PetAdListItemDto>), StatusCodes.Status200OK)]
	[ProducesResponseType(StatusCodes.Status401Unauthorized)]
	public async Task<IActionResult> GetFavoriteAds(GetUserFavoriteAdsQuery query, CancellationToken cancellationToken = default)
	{
		var result = await Mediator.Send(query, cancellationToken);

		if (result.IsSuccess)
			return Ok(result.Data);

		return result.ToActionResult();
	}
}
