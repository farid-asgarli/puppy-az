using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Constants;

namespace PetWebsite.Application.Features.PetAds.Queries.GetMyUploadedImages;

public class GetMyUploadedImagesQueryHandler(
	IApplicationDbContext dbContext,
	ICurrentUserService currentUserService,
	IUrlService urlService,
	IStringLocalizer localizer
) : BaseHandler(localizer), IQueryHandler<GetMyUploadedImagesQuery, Result<List<PetAdImageDto>>>
{
	public async Task<Result<List<PetAdImageDto>>> Handle(GetMyUploadedImagesQuery request, CancellationToken ct)
	{
		// Get current user ID
		var userId = currentUserService.UserId;
		if (userId is null)
			return Result<List<PetAdImageDto>>.Failure(L(LocalizationKeys.Error.Unauthorized), 401);

		// Get all unattached images uploaded by the current user
		var images = await dbContext
			.PetAdImages.Where(img => img.UploadedById == userId.Value && img.PetAdId == null)
			.OrderByDescending(img => img.UploadedAt)
			.Select(img => new PetAdImageDto
			{
				Id = img.Id,
				FilePath = img.FilePath,
				FileName = img.FileName,
				FileSize = img.FileSize,
				ContentType = img.ContentType,
				IsPrimary = img.IsPrimary,
				UploadedAt = img.UploadedAt,
				Url = img.FilePath, // Relative path (already contains "uploads/pet-ads/...")
			})
			.ToListAsync(ct);

		// Convert relative URLs to absolute URLs
		foreach (var image in images)
		{
			image.Url = urlService.ToAbsoluteUrl(image.Url);
		}

		return Result<List<PetAdImageDto>>.Success(images);
	}
}
