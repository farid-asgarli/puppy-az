using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Application.Extensions;
using PetWebsite.Domain.Constants;
using PetWebsite.Domain.Entities;
using PetWebsite.Domain.Enums;

namespace PetWebsite.Application.Features.PetAds.Commands.UpdatePetAd;

public class UpdatePetAdCommandHandler(IApplicationDbContext dbContext, IStringLocalizer localizer, ICurrentUserService currentUserService)
	: BaseHandler(localizer),
		ICommandHandler<UpdatePetAdCommand, Result>
{
	// Ad types where breed is optional
	private static readonly PetAdType[] OptionalBreedAdTypes = [PetAdType.Found, PetAdType.Owning];

	public async Task<Result> Handle(UpdatePetAdCommand request, CancellationToken ct)
	{
		var userId = currentUserService.UserId;
		if (userId == null)
			return Result.Failure(L(LocalizationKeys.Error.Unauthorized), 401);

		var petAd = await dbContext.PetAds.Include(p => p.Images).FirstOrDefaultAsync(p => p.Id == request.Id, ct);

		if (petAd == null)
			return Result.Failure(L(LocalizationKeys.PetAd.NotFound), 404);

		// Ensure the user owns this ad
		if (petAd.UserId != userId)
			return Result.Failure(L(LocalizationKeys.Error.Forbidden), 403);

		// Check if ad can be edited (cannot edit Closed ads)
		if (petAd.Status == PetAdStatus.Closed)
			return Result.Failure(L(LocalizationKeys.PetAd.CannotEditPublishedAd), 400);

		// Verify breed exists and is active (only if breed is provided)
		int? breedId = null;
		int? categoryId = request.PetCategoryId;

		if (request.PetBreedId.HasValue)
		{
			var breed = await dbContext
				.PetBreeds.WhereNotDeleted<PetBreed, int>()
				.Where(b => b.Id == request.PetBreedId.Value && b.IsActive)
				.FirstOrDefaultAsync(ct);

			if (breed is null)
				return Result.Failure(L(LocalizationKeys.PetAd.BreedNotFound), 404);

			breedId = breed.Id;
			// If breed is selected, use breed's category
			categoryId = breed.PetCategoryId;
		}
		else if (!OptionalBreedAdTypes.Contains(request.AdType) && string.IsNullOrWhiteSpace(request.SuggestedBreedName))
		{
			// Breed is required for Sale, Lost, and Match ad types (unless a breed suggestion is provided)
			return Result.Failure(L(LocalizationKeys.PetAd.BreedRequired), 400);
		}

		// Verify category exists if provided
		if (categoryId.HasValue)
		{
			var category = await dbContext
				.PetCategories.WhereNotDeleted<PetCategory, int>()
				.Where(c => c.Id == categoryId.Value && c.IsActive)
				.FirstOrDefaultAsync(ct);

			if (category is null)
				return Result.Failure(L(LocalizationKeys.PetAd.CategoryNotFound), 404);
		}

		// Verify city exists and is active
		var city = await dbContext
			.Cities.WhereNotDeleted<City, int>()
			.Where(c => c.Id == request.CityId && c.IsActive)
			.FirstOrDefaultAsync(ct);

		if (city is null)
			return Result.Failure(L(LocalizationKeys.PetAd.CityNotFound), 404);

		// Verify district exists and belongs to the city (if provided)
		if (request.DistrictId.HasValue)
		{
			var district = await dbContext
				.Districts.AsNoTracking()
				.Where(d => d.Id == request.DistrictId.Value && d.CityId == request.CityId && d.IsActive && !d.IsDeleted)
				.FirstOrDefaultAsync(ct);

			if (district is null)
				return Result.Failure(L(LocalizationKeys.PetAd.DistrictNotFound), 404);
		}

		// Update ad details
		petAd.Title = request.Title;
		petAd.Description = request.Description;
		petAd.AgeInMonths = request.AgeInMonths;
		petAd.Gender = request.Gender;
		petAd.AdType = request.AdType;
		petAd.Color = request.Color;
		petAd.Weight = request.Weight;
		petAd.Size = request.Size;
		petAd.Price = request.Price;
		petAd.CityId = request.CityId;
		petAd.DistrictId = request.DistrictId;
		petAd.CustomDistrictName = string.IsNullOrWhiteSpace(request.CustomDistrictName) ? null : request.CustomDistrictName.Trim();
		petAd.PetBreedId = breedId;
		petAd.PetCategoryId = categoryId;
		petAd.SuggestedBreedName = string.IsNullOrWhiteSpace(request.SuggestedBreedName) ? null : request.SuggestedBreedName.Trim();

		// Reset status to Pending for re-review
		petAd.Status = PetAdStatus.Pending;
		petAd.RejectionReason = null;

		// Handle images if provided
		if (request.ImageIds is not null && request.ImageIds.Count > 0)
		{
			// Get current image IDs for this ad
			var currentImageIds = petAd.Images.Select(img => img.Id).ToHashSet();
			
			// Fetch images that match the provided IDs
			// Include: images already attached to this ad OR new images not attached to any ad
			var images = await dbContext.PetAdImages
				.Where(img => request.ImageIds.Contains(img.Id) && (img.PetAdId == petAd.Id || img.PetAdId == null))
				.ToListAsync(ct);

			// Security check: Verify all images belong to the current user
			if (images.Any(img => img.UploadedById != userId.Value))
				return Result.Failure(L(LocalizationKeys.PetAd.ImagesMustBeOwnedByUser), 403);

			// Verify we found all requested images
			if (images.Count != request.ImageIds.Count)
				return Result.Failure(L(LocalizationKeys.PetAd.ImageNotFound), 404);

			// Find images to remove (in current but not in new list)
			var imagesToRemove = petAd.Images.Where(img => !request.ImageIds.Contains(img.Id)).ToList();
			foreach (var img in imagesToRemove)
			{
				img.PetAdId = null;
				img.IsPrimary = false;
			}

			// Clear and re-attach images in the correct order
			petAd.Images.Clear();
			
			// Attach images in the order specified by request.ImageIds
			var isFirst = true;
			foreach (var imageId in request.ImageIds)
			{
				var image = images.FirstOrDefault(img => img.Id == imageId);
				if (image != null)
				{
					image.PetAdId = petAd.Id;
					image.IsPrimary = isFirst;
					image.AttachedAt ??= DateTime.UtcNow;
					petAd.Images.Add(image);
					isFirst = false;
				}
			}
		}

		petAd.UpdatedAt = DateTime.UtcNow;

		await dbContext.SaveChangesAsync(ct);

		return Result.Success();
	}
}
