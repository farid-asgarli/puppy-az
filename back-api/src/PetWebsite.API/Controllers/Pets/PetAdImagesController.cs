using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using PetWebsite.API.Controllers.Base;
using PetWebsite.API.Extensions;
using PetWebsite.Application.Features.PetAds;
using PetWebsite.Application.Features.PetAds.Commands.DeletePetAdImage;
using PetWebsite.Application.Features.PetAds.Commands.UploadPetAdImage;
using PetWebsite.Application.Features.PetAds.Queries.GetMyUploadedImages;

namespace PetWebsite.API.Controllers.Pets;

/// <summary>
/// Controller for client-side pet ad image upload and management.
/// Provides secure image upload with ownership tracking.
/// Images are served as static files from /uploads/{filePath}
/// </summary>
[Authorize]
public class PetAdImagesController(IMediator mediator, IStringLocalizer<PetAdImagesController> localizer)
	: BaseApiController(mediator, localizer)
{
	/// <summary>
	/// Upload an image for a pet advertisement.
	/// Image will be stored with ownership tracking and can be attached to an ad later.
	/// </summary>
	/// <param name="file">The image file to upload (jpg, jpeg, png, webp). Max size: 5MB</param>
	/// <param name="cancellationToken">Cancellation token</param>
	/// <returns>The ID of the uploaded image</returns>
	/// <response code="201">Image uploaded successfully</response>
	/// <response code="400">Invalid file format or size</response>
	/// <response code="401">User is not authenticated</response>
	[HttpPost("upload")]
	// [RequestSizeLimit(3 * 1024 * 1024)] // 3 MB limit
	[Consumes("multipart/form-data")] // Add this
	[ProducesResponseType(typeof(int), StatusCodes.Status201Created)]
	[ProducesResponseType(StatusCodes.Status400BadRequest)]
	[ProducesResponseType(StatusCodes.Status401Unauthorized)]
	public async Task<IActionResult> UploadImage(IFormFile file, CancellationToken cancellationToken)
	{
		var command = new UploadPetAdImageCommand(file);
		var result = await Mediator.Send(command, cancellationToken);
		return result.ToActionResult();
	}

	/// <summary>
	/// Delete an uploaded pet ad image.
	/// Only the user who uploaded the image can delete it, and only if it's not yet attached to an ad.
	/// </summary>
	/// <param name="imageId">The ID of the image to delete</param>
	/// <param name="cancellationToken">Cancellation token</param>
	/// <returns>Success status</returns>
	/// <response code="200">Image deleted successfully</response>
	/// <response code="400">Image is already attached to an ad</response>
	/// <response code="401">User is not authenticated</response>
	/// <response code="403">User does not own this image</response>
	/// <response code="404">Image not found</response>
	[HttpDelete("{imageId:int}")]
	[ProducesResponseType(StatusCodes.Status200OK)]
	[ProducesResponseType(StatusCodes.Status400BadRequest)]
	[ProducesResponseType(StatusCodes.Status401Unauthorized)]
	[ProducesResponseType(StatusCodes.Status403Forbidden)]
	[ProducesResponseType(StatusCodes.Status404NotFound)]
	public async Task<IActionResult> DeleteImage(int imageId, CancellationToken cancellationToken)
	{
		var command = new DeletePetAdImageCommand(imageId);
		var result = await Mediator.Send(command, cancellationToken);
		return result.ToActionResult();
	}

	/// <summary>
	/// Get the current user's uploaded images that are not yet attached to an ad.
	/// Useful for displaying preview of uploaded images before ad submission.
	/// Images can be accessed directly via the URL field in the response (e.g., /uploads/pet-ads/filename.jpg)
	/// </summary>
	/// <param name="cancellationToken">Cancellation token</param>
	/// <returns>List of uploaded images with direct static file URLs</returns>
	/// <response code="200">Images retrieved successfully</response>
	/// <response code="401">User is not authenticated</response>
	[HttpGet("my-uploads")]
	[ProducesResponseType(typeof(List<PetAdImageDto>), StatusCodes.Status200OK)]
	[ProducesResponseType(StatusCodes.Status401Unauthorized)]
	public async Task<IActionResult> GetMyUploadedImages(CancellationToken cancellationToken)
	{
		var query = new GetMyUploadedImagesQuery();
		var result = await Mediator.Send(query, cancellationToken);
		return result.ToActionResult();
	}
}
