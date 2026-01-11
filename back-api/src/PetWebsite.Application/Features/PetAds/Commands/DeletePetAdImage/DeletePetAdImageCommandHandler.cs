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

		// Delete physical file
		try
		{
			await fileService.DeleteFileAsync(image.FilePath, ct);
		}
		catch
		{
			// Log but don't fail - we'll still remove the database record
			// File might already be deleted or inaccessible
		}

		// Delete database record
		dbContext.PetAdImages.Remove(image);
		await dbContext.SaveChangesAsync(ct);

		return Result.Success();
	}
}
