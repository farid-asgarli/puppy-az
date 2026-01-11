using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Constants;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Application.Features.PetAds.Commands.UploadPetAdImage;

public class UploadPetAdImageCommandHandler(
	IApplicationDbContext dbContext,
	IFileService fileService,
	ICurrentUserService currentUserService,
	IStringLocalizer localizer,
	IUrlService urlService
) : BaseHandler(localizer), ICommandHandler<UploadPetAdImageCommand, Result<PetAdImageDto>>
{
	public async Task<Result<PetAdImageDto>> Handle(UploadPetAdImageCommand request, CancellationToken ct)
	{
		// Get current user ID
		var userId = currentUserService.UserId;
		if (userId is null)
			return Result<PetAdImageDto>.Failure(L(LocalizationKeys.Error.Unauthorized), 401);

		// Save file to storage (in pet-ads subfolder)
		await using var stream = request.File.OpenReadStream();
		var fileMetadata = await fileService.SaveFileAsync(stream, request.File.FileName, "pet-ads", ct);

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
