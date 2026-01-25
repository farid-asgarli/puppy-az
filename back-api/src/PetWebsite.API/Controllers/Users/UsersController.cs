using Common.Repository.Filtering;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using PetWebsite.API.Controllers.Base;
using PetWebsite.API.Extensions;
using PetWebsite.Application.Common.Models;
using PetWebsite.Application.Features.PetAds;
using PetWebsite.Application.Features.PetAds.Queries.GetMyAdsQuestions;
using PetWebsite.Application.Features.PetAds.Queries.GetMyAdsQuestionsSummary;
using PetWebsite.Application.Features.PetAds.Queries.GetMyPetAdById;
using PetWebsite.Application.Features.PetAds.Queries.GetRecentlyViewedPetAds;
using PetWebsite.Application.Features.Users;
using PetWebsite.Application.Features.Users.Commands.ChangePassword;
using PetWebsite.Application.Features.Users.Commands.DeleteProfilePicture;
using PetWebsite.Application.Features.Users.Commands.UpdateProfile;
using PetWebsite.Application.Features.Users.Commands.UploadProfilePicture;
using PetWebsite.Application.Features.Users.Queries.GetUserActiveAds;
using PetWebsite.Application.Features.Users.Queries.GetUserAds;
using PetWebsite.Application.Features.Users.Queries.GetUserDashboardStats;
using PetWebsite.Application.Features.Users.Queries.GetUserPendingAds;
using PetWebsite.Application.Features.Users.Queries.GetUserProfile;
using PetWebsite.Application.Features.Users.Queries.GetUserRejectedAds;
using PetWebsite.Domain.Constants;

namespace PetWebsite.API.Controllers.Users;

/// <summary>
/// Controller for user profile and pet ad management.
/// </summary>
[Authorize]
public class UsersController(IMediator mediator, IStringLocalizer<UsersController> localizer) : BaseApiController(mediator, localizer)
{
	/// <summary>
	/// Get the current user's profile information.
	/// </summary>
	/// <param name="cancellationToken">Cancellation token</param>
	/// <returns>User profile information</returns>
	/// <response code="200">Returns the user profile</response>
	/// <response code="401">User is not authenticated</response>
	/// <response code="404">User not found</response>
	[HttpGet("profile")]
	[ProducesResponseType(typeof(UserProfileDto), StatusCodes.Status200OK)]
	[ProducesResponseType(StatusCodes.Status401Unauthorized)]
	[ProducesResponseType(StatusCodes.Status404NotFound)]
	public async Task<IActionResult> GetProfile(CancellationToken cancellationToken)
	{
		var result = await Mediator.Send(new GetUserProfileQuery(), cancellationToken);

		if (result.IsSuccess)
			return Ok(result.Data);

		return result.ToActionResult();
	}

	/// <summary>
	/// Update the current user's profile information.
	/// </summary>
	/// <param name="command">Profile update details</param>
	/// <param name="cancellationToken">Cancellation token</param>
	/// <returns>Success or failure result</returns>
	/// <response code="200">Profile updated successfully</response>
	/// <response code="400">Invalid request data</response>
	/// <response code="401">User is not authenticated</response>
	/// <response code="404">User not found</response>
	[HttpPut("profile")]
	[ProducesResponseType(StatusCodes.Status200OK)]
	[ProducesResponseType(StatusCodes.Status400BadRequest)]
	[ProducesResponseType(StatusCodes.Status401Unauthorized)]
	[ProducesResponseType(StatusCodes.Status404NotFound)]
	public async Task<IActionResult> UpdateProfile(UpdateUserProfileCommand command, CancellationToken cancellationToken)
	{
		var result = await Mediator.Send(command, cancellationToken);

		if (result.IsSuccess)
			return Ok(new { message = Localizer[LocalizationKeys.User.UpdateSuccess] });

		return result.ToActionResult();
	}

	/// <summary>
	/// Upload a profile picture for the current user.
	/// </summary>
	/// <param name="file">The image file to upload (jpg, jpeg, png, webp). Max size: 10MB</param>
	/// <param name="cancellationToken">Cancellation token</param>
	/// <returns>The URL of the uploaded profile picture</returns>
	/// <response code="200">Profile picture uploaded successfully</response>
	/// <response code="400">Invalid file format or size</response>
	/// <response code="401">User is not authenticated</response>
	[HttpPost("profile/picture")]
	[RequestSizeLimit(50 * 1024 * 1024)] // 50 MB limit - server will compress
	[Consumes("multipart/form-data")]
	[ProducesResponseType(typeof(ProfilePictureDto), StatusCodes.Status200OK)]
	[ProducesResponseType(StatusCodes.Status400BadRequest)]
	[ProducesResponseType(StatusCodes.Status401Unauthorized)]
	public async Task<IActionResult> UploadProfilePicture(IFormFile file, CancellationToken cancellationToken)
	{
		var command = new UploadProfilePictureCommand(file);
		var result = await Mediator.Send(command, cancellationToken);
		return result.ToActionResult();
	}

	/// <summary>
	/// Delete the current user's profile picture.
	/// </summary>
	/// <param name="cancellationToken">Cancellation token</param>
	/// <returns>No content on success</returns>
	/// <response code="204">Profile picture deleted successfully</response>
	/// <response code="401">User is not authenticated</response>
	[HttpDelete("profile/picture")]
	[ProducesResponseType(StatusCodes.Status204NoContent)]
	[ProducesResponseType(StatusCodes.Status401Unauthorized)]
	public async Task<IActionResult> DeleteProfilePicture(CancellationToken cancellationToken)
	{
		var result = await Mediator.Send(new DeleteProfilePictureCommand(), cancellationToken);
		return result.ToActionResult();
	}

	/// <summary>
	/// Get the current user's dashboard statistics.
	/// </summary>
	/// <param name="cancellationToken">Cancellation token</param>
	/// <returns>Dashboard statistics including ad counts, views, and favorites</returns>
	/// <response code="200">Returns the dashboard statistics</response>
	/// <response code="401">User is not authenticated</response>
	[HttpGet("dashboard/stats")]
	[ProducesResponseType(typeof(UserDashboardStatsDto), StatusCodes.Status200OK)]
	[ProducesResponseType(StatusCodes.Status401Unauthorized)]
	public async Task<IActionResult> GetDashboardStats(CancellationToken cancellationToken)
	{
		var result = await Mediator.Send(new GetUserDashboardStatsQuery(), cancellationToken);

		if (result.IsSuccess)
			return Ok(result.Data);

		return result.ToActionResult();
	}

	/// <summary>
	/// Get recently viewed pet advertisements by the current user.
	/// </summary>
	/// <param name="querySpec">Query specification with pagination and filters</param>
	/// <param name="cancellationToken">Cancellation token</param>
	/// <returns>Paginated list of recently viewed pet ads</returns>
	/// <response code="200">Returns the paginated list of recently viewed ads</response>
	/// <response code="401">User is not authenticated</response>
	[HttpPost("recently-viewed")]
	[ProducesResponseType(typeof(PaginatedResult<PetAdListItemDto>), StatusCodes.Status200OK)]
	[ProducesResponseType(StatusCodes.Status401Unauthorized)]
	public async Task<IActionResult> GetRecentlyViewedAds(
		[FromBody] GetRecentlyViewedPetAdsQuery querySpec,
		CancellationToken cancellationToken
	)
	{
		var result = await Mediator.Send(querySpec, cancellationToken);

		if (result.IsSuccess)
			return Ok(result.Data);

		return result.ToActionResult();
	}

	/// <summary>
	/// Get all questions asked on the current user's pet advertisements.
	/// </summary>
	/// <param name="querySpec">Query specification with pagination, filters, and optional unanswered filter</param>
	/// <param name="cancellationToken">Cancellation token</param>
	/// <returns>Paginated list of questions on user's ads</returns>
	/// <response code="200">Returns the paginated list of questions</response>
	/// <response code="401">User is not authenticated</response>
	[HttpPost("ads/questions")]
	[ProducesResponseType(typeof(PaginatedResult<MyAdQuestionDto>), StatusCodes.Status200OK)]
	[ProducesResponseType(StatusCodes.Status401Unauthorized)]
	public async Task<IActionResult> GetMyAdsQuestions([FromBody] GetMyAdsQuestionsQuery querySpec, CancellationToken cancellationToken)
	{
		var result = await Mediator.Send(querySpec, cancellationToken);

		if (result.IsSuccess)
			return Ok(result.Data);

		return result.ToActionResult();
	}

	/// <summary>
	/// Get a summary of questions asked on the current user's pet advertisements.
	/// </summary>
	/// <param name="cancellationToken">Cancellation token</param>
	/// <returns>Summary statistics of questions</returns>
	/// <response code="200">Returns the questions summary</response>
	/// <response code="401">User is not authenticated</response>
	[HttpGet("ads/questions/summary")]
	[ProducesResponseType(typeof(MyAdsQuestionsSummaryDto), StatusCodes.Status200OK)]
	[ProducesResponseType(StatusCodes.Status401Unauthorized)]
	public async Task<IActionResult> GetMyAdsQuestionsSummary(CancellationToken cancellationToken)
	{
		var result = await Mediator.Send(new GetMyAdsQuestionsSummaryQuery(), cancellationToken);

		if (result.IsSuccess)
			return Ok(result.Data);

		return result.ToActionResult();
	}

	/// <summary>
	/// Change the current user's password.
	/// </summary>
	/// <param name="command">Password change details</param>
	/// <param name="cancellationToken">Cancellation token</param>
	/// <returns>Success or failure result</returns>
	/// <response code="200">Password changed successfully</response>
	/// <response code="400">Invalid current password or new password does not meet requirements</response>
	/// <response code="401">User is not authenticated</response>
	/// <response code="404">User not found</response>
	[HttpPost("change-password")]
	[ProducesResponseType(StatusCodes.Status200OK)]
	[ProducesResponseType(StatusCodes.Status400BadRequest)]
	[ProducesResponseType(StatusCodes.Status401Unauthorized)]
	[ProducesResponseType(StatusCodes.Status404NotFound)]
	public async Task<IActionResult> ChangePassword(ChangePasswordCommand command, CancellationToken cancellationToken)
	{
		var result = await Mediator.Send(command, cancellationToken);

		if (result.IsSuccess)
			return Ok(new { message = Localizer[LocalizationKeys.User.PasswordChangedSuccess] });

		return result.ToActionResult();
	}

	/// <summary>
	/// Get the current user's active (published) pet advertisements.
	/// </summary>
	/// <param name="pageNumber">Page number (default: 1)</param>
	/// <param name="pageSize">Page size (default: 20)</param>
	/// <param name="cancellationToken">Cancellation token</param>
	/// <returns>Paginated list of active pet ads</returns>
	/// <response code="200">Returns the paginated list of active pet ads</response>
	/// <response code="401">User is not authenticated</response>
	[HttpPost("ads/active")]
	[ProducesResponseType(typeof(PaginatedResult<PetAdListItemDto>), StatusCodes.Status200OK)]
	[ProducesResponseType(StatusCodes.Status401Unauthorized)]
	public async Task<IActionResult> GetActiveAds([FromBody] GetUserActiveAdsQuery querySpec, CancellationToken cancellationToken)
	{
		var result = await Mediator.Send(querySpec, cancellationToken);

		if (result.IsSuccess)
			return Ok(result.Data);

		return result.ToActionResult();
	}

	/// <summary>
	/// Get the current user's pending or rejected pet advertisements.
	/// </summary>
	/// <param name="pageNumber">Page number (default: 1)</param>
	/// <param name="pageSize">Page size (default: 20)</param>
	/// <param name="cancellationToken">Cancellation token</param>
	/// <returns>Paginated list of pending pet ads</returns>
	/// <response code="200">Returns the paginated list of pending pet ads</response>
	/// <response code="401">User is not authenticated</response>
	[HttpPost("ads/pending")]
	[ProducesResponseType(typeof(PaginatedResult<PetAdListItemDto>), StatusCodes.Status200OK)]
	[ProducesResponseType(StatusCodes.Status401Unauthorized)]
	public async Task<IActionResult> GetPendingAds([FromBody] GetUserPendingAdsQuery querySpec, CancellationToken cancellationToken)
	{
		var result = await Mediator.Send(querySpec, cancellationToken);

		if (result.IsSuccess)
			return Ok(result.Data);

		return result.ToActionResult();
	}

	/// <summary>
	/// Get all pet advertisements owned by the current user.
	/// </summary>
	/// <param name="pageNumber">Page number (default: 1)</param>
	/// <param name="pageSize">Page size (default: 20)</param>
	/// <param name="cancellationToken">Cancellation token</param>
	/// <returns>Paginated list of all pet ads</returns>
	/// <response code="200">Returns the paginated list of all pet ads</response
	/// <response code="401">User is not authenticated</response>

	[HttpPost("ads/all")]
	[ProducesResponseType(typeof(PaginatedResult<PetAdListItemDto>), StatusCodes.Status200OK)]
	[ProducesResponseType(StatusCodes.Status401Unauthorized)]
	public async Task<IActionResult> GetAllAds([FromBody] GetUserAdsQuery querySpec, CancellationToken cancellationToken)
	{
		var result = await Mediator.Send(querySpec, cancellationToken);

		if (result.IsSuccess)
			return Ok(result.Data);

		return result.ToActionResult();
	}

	/// <summary>
	/// Get the current user's rejected pet advertisements.
	/// </summary>
	/// <param name="pageNumber">Page number (default: 1)</param>
	/// <param name="pageSize">Page size (default: 20)</param>
	/// <param name="cancellationToken">Cancellation token</param>
	/// <returns>Paginated list of rejected pet ads</returns>
	/// <response code="200">Returns the paginated list of rejected pet ads</response>
	/// <response code="401">User is not authenticated</response>
	[HttpPost("ads/rejected")]
	[ProducesResponseType(typeof(PaginatedResult<PetAdListItemDto>), StatusCodes.Status200OK)]
	[ProducesResponseType(StatusCodes.Status401Unauthorized)]
	public async Task<IActionResult> GetRejectedAds([FromBody] GetUserRejectedAdsQuery querySpec, CancellationToken cancellationToken)
	{
		var result = await Mediator.Send(querySpec, cancellationToken);

		if (result.IsSuccess)
			return Ok(result.Data);

		return result.ToActionResult();
	}

	/// <summary>
	/// Get detailed information about a specific pet ad owned by the current user.
	/// </summary>
	/// <param name="id">Pet ad ID</param>
	/// <param name="cancellationToken">Cancellation token</param>
	/// <returns>Detailed ad information including status, rejection reason, and statistics</returns>
	/// <response code="200">Returns the pet ad details</response>
	/// <response code="401">User is not authenticated</response>
	/// <response code="404">Pet ad not found or not owned by user</response>
	[HttpGet("ads/{id:int}")]
	[ProducesResponseType(typeof(MyPetAdDetailsDto), StatusCodes.Status200OK)]
	[ProducesResponseType(StatusCodes.Status401Unauthorized)]
	[ProducesResponseType(StatusCodes.Status404NotFound)]
	public async Task<IActionResult> GetMyPetAd(int id, CancellationToken cancellationToken)
	{
		var result = await Mediator.Send(new GetMyPetAdByIdQuery(id), cancellationToken);

		if (result.IsSuccess)
			return Ok(result.Data);

		return result.ToActionResult();
	}
}
