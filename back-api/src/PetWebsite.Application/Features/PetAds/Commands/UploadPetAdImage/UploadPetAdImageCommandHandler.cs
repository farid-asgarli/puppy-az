using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Constants;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Application.Features.PetAds.Commands.UploadPetAdImage;

public class UploadPetAdImageCommandHandler(
	IApplicationDbContext dbContext,
	IFileService fileService,
	IImageProcessingService imageProcessingService,
	ICurrentUserService currentUserService,
	IStringLocalizer localizer,
	IUrlService urlService,
	ILogger<UploadPetAdImageCommandHandler> logger
) : BaseHandler(localizer), ICommandHandler<UploadPetAdImageCommand, Result<PetAdImageDto>>
{
	public async Task<Result<PetAdImageDto>> Handle(UploadPetAdImageCommand request, CancellationToken ct)
	{
		// Get current user ID
		var userId = currentUserService.UserId;
		if (userId is null)
			return Result<PetAdImageDto>.Failure(L(LocalizationKeys.Error.Unauthorized), 401);

		// Open the file stream
		await using var originalStream = request.File.OpenReadStream();
		var originalFileName = request.File.FileName;

		// Process/compress the image if it's above the threshold
		Stream streamToSave;
		string fileNameToSave;

		if (imageProcessingService.IsSupportedImageFormat(originalFileName))
		{
			var processingResult = await imageProcessingService.ProcessImageAsync(originalStream, originalFileName, ct);

			if (processingResult.WasProcessed)
			{
				logger.LogInformation(
					"Image {OriginalFileName} compressed: {OriginalSize} -> {ProcessedSize} bytes ({Reduction:P1} reduction)",
					originalFileName,
					processingResult.OriginalSize,
					processingResult.ProcessedSize,
					1 - (double)processingResult.ProcessedSize / processingResult.OriginalSize
				);

				streamToSave = processingResult.ProcessedStream;
				fileNameToSave = processingResult.ProcessedFileName;
			}
			else
			{
				// Image wasn't processed, use the processed stream (which is a copy of original)
				streamToSave = processingResult.ProcessedStream;
				fileNameToSave = originalFileName;
			}
		}
		else
		{
			// Not a supported image format, use original
			streamToSave = originalStream;
			fileNameToSave = originalFileName;
		}

		// Save file to storage (in pet-ads subfolder)
		var fileMetadata = await fileService.SaveFileAsync(streamToSave, fileNameToSave, "pet-ads", ct);

		// Dispose the processed stream if it was created
		if (streamToSave != originalStream)
		{
			await streamToSave.DisposeAsync();
		}

		// Create database record with ownership tracking
		// Store path as "uploads/pet-ads/filename.jpg" for consistency
		var petAdImage = new PetAdImage
		{
			FilePath = $"/uploads/{fileMetadata.RelativePath}",
			FileName = fileMetadata.FileName,
			FileSize = fileMetadata.Size,
			ContentType = fileMetadata.ContentType,
			UploadedById = userId.Value,
			UploadedAt = DateTime.UtcNow,
			IsPrimary = false,
			PetAdId = null, // Orphaned state - not yet attached to an ad
			AttachedAt = null,
		};

		dbContext.PetAdImages.Add(petAdImage);
		await dbContext.SaveChangesAsync(ct);

		return Result<PetAdImageDto>.Success(
			new PetAdImageDto
			{
				Id = petAdImage.Id,
				FilePath = petAdImage.FilePath,
				FileName = petAdImage.FileName,
				FileSize = petAdImage.FileSize,
				ContentType = petAdImage.ContentType,
				IsPrimary = petAdImage.IsPrimary,
				UploadedAt = petAdImage.UploadedAt,
				Url = urlService.ToAbsoluteUrl(petAdImage.FilePath), // Direct static file URL (already has "uploads/" prefix)
			}
		);
	}
}
