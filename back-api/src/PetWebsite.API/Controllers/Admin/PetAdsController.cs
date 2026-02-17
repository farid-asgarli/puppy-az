using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using PetWebsite.API.Constants;
using PetWebsite.API.Controllers.Base;
using PetWebsite.API.Extensions;
using PetWebsite.Application.Common.Models;
using PetWebsite.Application.Features.Admin.PetAds.Commands.CreatePetAd;
using PetWebsite.Application.Features.Admin.PetAds.Commands.ReviewPetAd;
using PetWebsite.Application.Features.Admin.PetAds.Commands.AssignBreedToAd;
using PetWebsite.Application.Features.Admin.PetAds.Commands.AssignDistrictToAd;
using PetWebsite.Application.Features.Admin.PetAds.Commands.SetPetAdPremium;
using PetWebsite.Application.Features.Admin.PetAds.Commands.SetPetAdStatus;
using PetWebsite.Application.Features.Admin.PetAds.Commands.SetPetAdVip;
using PetWebsite.Application.Features.Admin.PetAds.Commands.UpdatePetAd;
using PetWebsite.Application.Features.Admin.PetAds.Queries.GetPetAdById;
using PetWebsite.Application.Features.Admin.PetAds.Queries.SearchPetAds;
using PetWebsite.Application.Features.PetAds;
using PetWebsite.Application.Features.PetAds.Commands.UploadPetAdImage;

namespace PetWebsite.API.Controllers.Admin;

/// <summary>
/// Controller for managing pet advertisements (admin only).
/// </summary>
[Authorize(Roles = $"{AuthorizationConstants.Roles.SuperAdmin},{AuthorizationConstants.Roles.Admin}")]
public class PetAdsController(IMediator mediator, IStringLocalizer<PetAdsController> localizer) : AdminBaseController(mediator, localizer)
{
	/// <summary>
	/// Create a new pet advertisement on behalf of a user (admin only).
	/// The ad will be immediately published without pending review.
	/// </summary>
	/// <param name="command">Pet ad creation details</param>
	/// <param name="cancellationToken">Cancellation token</param>
	/// <returns>The ID of the created pet ad</returns>
	/// <response code="201">Pet ad created successfully and is published</response>
	/// <response code="400">Invalid request data</response>
	/// <response code="404">User, breed, category, or city not found</response>
	[HttpPost]
	[ProducesResponseType(typeof(int), StatusCodes.Status201Created)]
	[ProducesResponseType(StatusCodes.Status400BadRequest)]
	[ProducesResponseType(StatusCodes.Status404NotFound)]
	public async Task<IActionResult> CreatePetAd(CreatePetAdByAdminCommand command, CancellationToken cancellationToken)
	{
		var result = await Mediator.Send(command, cancellationToken);

		if (result.IsSuccess)
		{
			return CreatedAtAction(
				nameof(GetPetAdById),
				new { id = result.Data },
				new { id = result.Data }
			);
		}

		return result.ToActionResult();
	}

	/// <summary>
	/// Update a pet advertisement (admin only).
	/// Admin can update any ad regardless of status or ownership.
	/// </summary>
	/// <param name="id">Pet ad ID</param>
	/// <param name="command">Updated pet ad details</param>
	/// <param name="cancellationToken">Cancellation token</param>
	/// <returns>No content on success</returns>
	/// <response code="204">Pet ad updated successfully</response>
	/// <response code="400">Invalid request data</response>
	/// <response code="404">Pet ad, breed, category, or city not found</response>
	[HttpPut("{id:int}")]
	[ProducesResponseType(StatusCodes.Status204NoContent)]
	[ProducesResponseType(StatusCodes.Status400BadRequest)]
	[ProducesResponseType(StatusCodes.Status404NotFound)]
	public async Task<IActionResult> UpdatePetAd(int id, UpdatePetAdByAdminCommand command, CancellationToken cancellationToken)
	{
		if (id != command.Id)
			return BadRequest("ID mismatch");

		var result = await Mediator.Send(command, cancellationToken);

		if (result.IsSuccess)
			return NoContent();

		return result.ToActionResult();
	}

	/// <summary>
	/// Search pet advertisements with filters (admin only - no status restrictions).
	/// </summary>
	/// <param name="query">Search query with filter, sorting, and pagination</param>
	/// <param name="cancellationToken">Cancellation token</param>
	/// <returns>Paginated list of pet ads</returns>
	/// <response code="200">Returns the paginated list of pet ads</response>
	[HttpPost("search")]
	[ProducesResponseType(typeof(PaginatedResult<MyPetAdListItemDto>), StatusCodes.Status200OK)]
	public async Task<IActionResult> SearchPetAds([FromBody] AdminSearchPetAdsQuery query, CancellationToken cancellationToken)
	{
		var result = await Mediator.Send(query, cancellationToken);

		if (result.IsSuccess)
			return Ok(result.Data);

		return result.ToActionResult();
	}

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

	/// <summary>
	/// Set the status of a pet advertisement (admin only).
	/// </summary>
	/// <param name="id">Pet ad ID</param>
	/// <param name="command">New status for the pet ad</param>
	/// <param name="cancellationToken">Cancellation token</param>
	/// <returns>No content on success</returns>
	/// <response code="204">Status updated successfully</response>
	/// <response code="400">Invalid request</response>
	/// <response code="404">Pet ad not found</response>
	[HttpPost("{id:int}/set-status")]
	[ProducesResponseType(StatusCodes.Status204NoContent)]
	[ProducesResponseType(StatusCodes.Status400BadRequest)]
	[ProducesResponseType(StatusCodes.Status404NotFound)]
	public async Task<IActionResult> SetPetAdStatus(int id, SetPetAdStatusCommand command, CancellationToken cancellationToken)
	{
		if (id != command.Id)
			return BadRequest("ID mismatch");

		var result = await Mediator.Send(command, cancellationToken);

		if (result.IsSuccess)
			return NoContent();

		return result.ToActionResult();
	}

	/// <summary>
	/// Set or remove VIP status for a pet advertisement.
	/// VIP ads appear at the top only within their own category.
	/// </summary>
	/// <param name="id">Pet ad ID</param>
	/// <param name="command">VIP status configuration</param>
	/// <param name="cancellationToken">Cancellation token</param>
	/// <returns>No content on success</returns>
	/// <response code="204">VIP status updated successfully</response>
	/// <response code="400">Invalid request</response>
	/// <response code="404">Pet ad not found</response>
	[HttpPost("{id:int}/vip")]
	[ProducesResponseType(StatusCodes.Status204NoContent)]
	[ProducesResponseType(StatusCodes.Status400BadRequest)]
	[ProducesResponseType(StatusCodes.Status404NotFound)]
	public async Task<IActionResult> SetVipStatus(int id, SetPetAdVipCommand command, CancellationToken cancellationToken)
	{
		if (id != command.Id)
			return BadRequest("ID mismatch");

		var result = await Mediator.Send(command, cancellationToken);

		if (result.IsSuccess)
			return NoContent();

		return result.ToActionResult();
	}

	/// <summary>
	/// Get a pet advertisement by ID (admin only - no status restrictions).
	/// </summary>
	/// <param name="id">Pet ad ID</param>
	/// <param name="cancellationToken">Cancellation token</param>
	/// <returns>Pet ad details</returns>
	/// <response code="200">Returns the pet ad details</response>
	/// <response code="404">Pet ad not found</response>
	[HttpGet("{id:int}")]
	[ProducesResponseType(typeof(MyPetAdListItemDto), StatusCodes.Status200OK)]
	[ProducesResponseType(StatusCodes.Status404NotFound)]
	public async Task<IActionResult> GetPetAdById(int id, CancellationToken cancellationToken)
	{
		var result = await Mediator.Send(new AdminGetPetAdByIdQuery(id), cancellationToken);

		if (result.IsSuccess)
			return Ok(result.Data);

		return result.ToActionResult();
	}

	/// <summary>
	/// Assign a breed to a pet advertisement (admin only).
	/// Used after creating a breed from a user's suggestion.
	/// Clears the suggested breed name after assignment.
	/// </summary>
	/// <param name="id">Pet ad ID</param>
	/// <param name="command">Breed assignment details</param>
	/// <param name="cancellationToken">Cancellation token</param>
	/// <returns>No content on success</returns>
	/// <response code="204">Breed assigned successfully</response>
	/// <response code="400">Invalid request</response>
	/// <response code="404">Pet ad or breed not found</response>
	[HttpPost("{id:int}/assign-breed")]
	[ProducesResponseType(StatusCodes.Status204NoContent)]
	[ProducesResponseType(StatusCodes.Status400BadRequest)]
	[ProducesResponseType(StatusCodes.Status404NotFound)]
	public async Task<IActionResult> AssignBreedToAd(int id, AssignBreedToAdCommand command, CancellationToken cancellationToken)
	{
		if (id != command.PetAdId)
			return BadRequest("ID mismatch");

		var result = await Mediator.Send(command, cancellationToken);

		if (result.IsSuccess)
			return NoContent();

		return result.ToActionResult();
	}

	/// <summary>
	/// Assign a district to a pet advertisement.
	/// Used after admin creates a district from a user's suggestion.
	/// </summary>
	/// <param name="id">Pet ad ID</param>
	/// <param name="command">District assignment details</param>
	/// <param name="cancellationToken">Cancellation token</param>
	/// <returns>No content on success</returns>
	[HttpPost("{id:int}/assign-district")]
	[ProducesResponseType(StatusCodes.Status204NoContent)]
	[ProducesResponseType(StatusCodes.Status400BadRequest)]
	[ProducesResponseType(StatusCodes.Status404NotFound)]
	public async Task<IActionResult> AssignDistrictToAd(int id, AssignDistrictToAdCommand command, CancellationToken cancellationToken)
	{
		if (id != command.PetAdId)
			return BadRequest("ID mismatch");

		var result = await Mediator.Send(command, cancellationToken);

		if (result.IsSuccess)
			return NoContent();

		return result.ToActionResult();
	}

	/// <summary>
	/// Upload images for a pet advertisement (admin only).
	/// Supports multiple file upload.
	/// </summary>
	/// <param name="file">Single image file (for backward compatibility)</param>
	/// <param name="files">Multiple image files (optional)</param>
	/// <param name="cancellationToken">Cancellation token</param>
	/// <returns>Uploaded image data</returns>
	/// <response code="200">Images uploaded successfully</response>
	/// <response code="400">Invalid files or too many files</response>
	[HttpPost("images/upload")]
	[Consumes("multipart/form-data")]
	[ProducesResponseType(typeof(List<PetAdImageDto>), StatusCodes.Status200OK)]
	[ProducesResponseType(StatusCodes.Status400BadRequest)]
	public async Task<IActionResult> UploadImages(
		[FromForm] IFormFile? file = null,
		[FromForm] List<IFormFile>? files = null,
		[FromForm] Guid? userId = null,
		CancellationToken cancellationToken = default)
	{
		// Combine single file and multiple files
		var allFiles = new List<IFormFile>();
		if (file != null)
			allFiles.Add(file);
		if (files != null && files.Count > 0)
			allFiles.AddRange(files);

		if (allFiles.Count == 0)
			return BadRequest("No files provided");

		if (allFiles.Count > 10)
			return BadRequest("Maximum 10 files allowed");

		var uploadedImages = new List<PetAdImageDto>();

		foreach (var f in allFiles)
		{
			// Pass userId so image is owned by the target user, not the admin
			var command = new UploadPetAdImageCommand(f, userId);
			var result = await Mediator.Send(command, cancellationToken);

			if (!result.IsSuccess)
				return result.ToActionResult();

			uploadedImages.Add(result.Data!);
		}

		return Ok(uploadedImages);
	}}