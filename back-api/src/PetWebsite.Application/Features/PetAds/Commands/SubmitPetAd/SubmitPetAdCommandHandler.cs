using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Application.Extensions;
using PetWebsite.Domain.Constants;
using PetWebsite.Domain.Entities;
using PetWebsite.Domain.Enums;

namespace PetWebsite.Application.Features.PetAds.Commands.SubmitPetAd;

public class SubmitPetAdCommandHandler(IApplicationDbContext dbContext, IStringLocalizer localizer, ICurrentUserService currentUserService)
	: BaseHandler(localizer),
		ICommandHandler<SubmitPetAdCommand, Result<int>>
{
	public async Task<Result<int>> Handle(SubmitPetAdCommand request, CancellationToken ct)
	{
		// Verify breed exists and is active
		var breed = await dbContext
			.PetBreeds.WhereNotDeleted<PetBreed, int>()
			.Where(b => b.Id == request.PetBreedId && b.IsActive)
			.FirstOrDefaultAsync(ct);

		if (breed is null)
			return Result<int>.Failure(L(LocalizationKeys.PetAd.BreedNotFound), 404);

		// Verify city exists and is active
		var city = await dbContext
			.Cities.WhereNotDeleted<City, int>()
			.Where(c => c.Id == request.CityId && c.IsActive)
			.FirstOrDefaultAsync(ct);

		if (city is null)
			return Result<int>.Failure(L(LocalizationKeys.PetAd.CityNotFound), 404);

		// Get current user ID
		var userId = currentUserService.UserId;
		if (userId is null)
			return Result<int>.Failure(L(LocalizationKeys.Error.Unauthorized), 401);

		// Calculate expiration date (e.g., 30 days from now)
		var expiresAt = DateTime.UtcNow.AddDays(30);

		// Create the pet ad with Pending status
		var petAd = new PetAd
		{
			Title = request.Title,
			Description = request.Description,
			AgeInMonths = request.AgeInMonths,
			Gender = request.Gender,
			AdType = request.AdType,
			Color = request.Color,
			Weight = request.Weight,
			Size = request.Size,
			Price = request.Price,
			CityId = request.CityId,
			PetBreedId = request.PetBreedId,
			UserId = userId,
			Status = PetAdStatus.Pending, // Default status for user submissions
			IsAvailable = true,
			ViewCount = 0,
			ExpiresAt = expiresAt,
		};

		// Link existing uploaded images if provided
		if (request.ImageIds is not null && request.ImageIds.Count > 0)
		{
			// Fetch images that match the provided IDs
			var images = await dbContext
				.PetAdImages.Where(img => request.ImageIds.Contains(img.Id) && img.PetAdId == null) // Images not yet linked to any ad
				.ToListAsync(ct);

			// Security check: Verify all images belong to the current user
			if (images.Any(img => img.UploadedById != userId.Value))
				return Result<int>.Failure(L(LocalizationKeys.PetAd.ImagesMustBeOwnedByUser), 403);

			// Verify we found all requested images
			if (images.Count != request.ImageIds.Count)
				return Result<int>.Failure(L(LocalizationKeys.PetAd.ImageNotFound), 404);

			// Attach images to the pet ad
			if (images.Count > 0)
			{
				var isFirst = true;
				foreach (var image in images)
				{
					image.IsPrimary = isFirst; // First image is primary
					image.AttachedAt = DateTime.UtcNow;
					isFirst = false;
				}

				petAd.Images = images;
			}
		}

		dbContext.PetAds.Add(petAd);
		await dbContext.SaveChangesAsync(ct);

		return Result<int>.Success(petAd.Id, 201);
	}
}
