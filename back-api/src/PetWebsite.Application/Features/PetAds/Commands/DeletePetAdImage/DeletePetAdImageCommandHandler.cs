using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Constants;

namespace PetWebsite.Application.Features.PetAds.Commands.DeletePetAdImage;

public class DeletePetAdImageCommandHandler(
	IApplicationDbContext dbContext,
	IFileService fileService,
	ICurrentUserService currentUserService,
	IStringLocalizer localizer
) : BaseHandler(localizer), ICommandHandler<DeletePetAdImageCommand, Result>
{
	public async Task<Result> Handle(DeletePetAdImageCommand request, CancellationToken ct)
	{
		// Get current user ID
		var userId = currentUserService.UserId;
		if (userId is null)
			return Result.Failure(L(LocalizationKeys.Error.Unauthorized), 401);

		// Find the image
		var image = await dbContext.PetAdImages.FirstOrDefaultAsync(img => img.Id == request.ImageId, ct);

		if (image is null)
			return Result.Failure(L(LocalizationKeys.PetAd.ImageNotFound), 404);

		// Verify ownership
		if (image.UploadedById != userId.Value)
			return Result.Failure(L(LocalizationKeys.PetAd.ImageNotOwnedByUser), 403);

		// Verify the image is not yet attached to an ad
		if (image.PetAdId.HasValue)
			return Result.Failure(L(LocalizationKeys.PetAd.ImageAlreadyAttached), 400);

		// Delete physical file (and its watermarked twin, if any).
		// Stored paths are web paths like "/uploads/pet-ads/x.jpg"; the file storage root
		// already points at the "uploads" folder, so strip that prefix before deleting.
		await TryDeletePhysicalFileAsync(fileService, image.FilePath, ct);
		await TryDeletePhysicalFileAsync(fileService, image.WatermarkedFilePath, ct);

		// Delete database record
		dbContext.PetAdImages.Remove(image);
		await dbContext.SaveChangesAsync(ct);

		return Result.Success();
	}

	private static async Task TryDeletePhysicalFileAsync(IFileService fileService, string? storedPath, CancellationToken ct)
	{
		if (string.IsNullOrEmpty(storedPath))
			return;

		var relativePath = storedPath.StartsWith("/uploads/", StringComparison.OrdinalIgnoreCase)
			? storedPath["/uploads/".Length..]
			: storedPath.TrimStart('/');

		try
		{
			await fileService.DeleteFileAsync(relativePath, ct);
		}
		catch
		{
			// Best-effort cleanup; the file may already be gone or inaccessible.
		}
	}
}
