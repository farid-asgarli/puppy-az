using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Constants;

namespace PetWebsite.Application.Features.PetAds.Queries.GetPetAdImage;

public class GetPetAdImageQueryHandler(IApplicationDbContext dbContext, IUrlService urlService, IStringLocalizer localizer)
	: BaseHandler(localizer),
		IQueryHandler<GetPetAdImageQuery, Result<PetAdImageDto>>
{
	public async Task<Result<PetAdImageDto>> Handle(GetPetAdImageQuery request, CancellationToken ct)
	{
		var image = await dbContext
			.PetAdImages.Where(img => img.Id == request.ImageId)
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
			.FirstOrDefaultAsync(ct);

		if (image is null)
			return Result<PetAdImageDto>.Failure(L(LocalizationKeys.PetAd.ImageNotFound), 404);

		// Convert relative URL to absolute URL
		image.Url = urlService.ToAbsoluteUrl(image.Url);

		return Result<PetAdImageDto>.Success(image);
	}
}
