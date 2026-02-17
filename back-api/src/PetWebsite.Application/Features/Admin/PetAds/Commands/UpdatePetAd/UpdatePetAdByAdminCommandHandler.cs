using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Application.Extensions;
using PetWebsite.Domain.Constants;
using PetWebsite.Domain.Entities;
using PetWebsite.Domain.Enums;

namespace PetWebsite.Application.Features.Admin.PetAds.Commands.UpdatePetAd;

public class UpdatePetAdByAdminCommandHandler(
	IApplicationDbContext dbContext,
	IStringLocalizer localizer,
	ILogger<UpdatePetAdByAdminCommandHandler> logger)
	: BaseHandler(localizer),
		ICommandHandler<UpdatePetAdByAdminCommand, Result>
{
	// Ad types where breed is optional
	private static readonly PetAdType[] OptionalBreedAdTypes = [PetAdType.Found, PetAdType.Owning];

	public async Task<Result> Handle(UpdatePetAdByAdminCommand request, CancellationToken ct)
	{
		var petAd = await dbContext.PetAds
			.Include(p => p.Images)
			.FirstOrDefaultAsync(p => p.Id == request.Id, ct);

		if (petAd == null)
			return Result.Failure(L(LocalizationKeys.PetAd.NotFound), 404);

		// Admin can edit any ad regardless of status or ownership

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
		else if (!OptionalBreedAdTypes.Contains(request.AdType))
		{
			// Breed is required for Sale, Lost, and Match ad types
			return Result.Failure(L(LocalizationKeys.PetAd.BreedRequired), 400);
		}

		// Verify category exists if provided
		if (categoryId.HasValue)
		{
			var categoryExists = await dbContext
				.PetCategories.WhereNotDeleted<PetCategory, int>()
				.AnyAsync(c => c.Id == categoryId.Value && c.IsActive, ct);

			if (!categoryExists)
				return Result.Failure(L(LocalizationKeys.PetAd.CategoryNotFound), 404);
		}

		// Verify city exists and is active
		var cityExists = await dbContext
			.Cities.WhereNotDeleted<City, int>()
			.AnyAsync(c => c.Id == request.CityId && c.IsActive, ct);

		if (!cityExists)
			return Result.Failure(L(LocalizationKeys.PetAd.CityNotFound), 404);

		// Verify district exists, belongs to city, and is active (if provided)
		if (request.DistrictId.HasValue)
		{
			var districtExists = await dbContext
				.Districts.WhereNotDeleted<District, int>()
				.AnyAsync(d => d.Id == request.DistrictId.Value && d.CityId == request.CityId && d.IsActive, ct);

			if (!districtExists)
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
		petAd.PetBreedId = breedId;
		petAd.PetCategoryId = categoryId;

		// Admin updates don't change status - keep current status

		// Handle images if provided
		if (request.ImageIds is not null && request.ImageIds.Count > 0)
		{
			// Fetch images that match the provided IDs
			// Include: images already attached to this ad OR new images not attached to any ad
			var images = await dbContext.PetAdImages
				.Where(img => request.ImageIds.Contains(img.Id) && (img.PetAdId == petAd.Id || img.PetAdId == null))
				.ToListAsync(ct);

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

		logger.LogInformation("Admin updated pet ad {AdId}", petAd.Id);

		return Result.Success();
	}
}
