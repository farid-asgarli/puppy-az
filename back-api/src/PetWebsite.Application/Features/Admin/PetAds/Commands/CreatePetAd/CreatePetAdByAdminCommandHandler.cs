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

namespace PetWebsite.Application.Features.Admin.PetAds.Commands.CreatePetAd;

public class CreatePetAdByAdminCommandHandler(
	IApplicationDbContext dbContext,
	IStringLocalizer localizer,
	ILogger<CreatePetAdByAdminCommandHandler> logger)
	: BaseHandler(localizer),
		ICommandHandler<CreatePetAdByAdminCommand, Result<int>>
{
	// Ad types where breed is optional
	private static readonly PetAdType[] OptionalBreedAdTypes = [PetAdType.Found, PetAdType.Owning];

	public async Task<Result<int>> Handle(CreatePetAdByAdminCommand request, CancellationToken ct)
	{
		// Verify user exists
		var userExists = await dbContext.RegularUsers
			.AnyAsync(u => u.Id == request.UserId, ct);

		if (!userExists)
			return Result<int>.Failure(L(LocalizationKeys.User.NotFound), 404);

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
				return Result<int>.Failure(L(LocalizationKeys.PetAd.BreedNotFound), 404);

			breedId = breed.Id;
			// If breed is selected, use breed's category
			categoryId = breed.PetCategoryId;
		}
		else if (!OptionalBreedAdTypes.Contains(request.AdType))
		{
			// Breed is required for Sale, Lost, and Match ad types
			return Result<int>.Failure(L(LocalizationKeys.PetAd.BreedRequired), 400);
		}

		// Verify category exists if provided
		if (categoryId.HasValue)
		{
			var categoryExists = await dbContext
				.PetCategories.WhereNotDeleted<PetCategory, int>()
				.AnyAsync(c => c.Id == categoryId.Value && c.IsActive, ct);

			if (!categoryExists)
				return Result<int>.Failure(L(LocalizationKeys.PetAd.CategoryNotFound), 404);
		}

		// Verify city exists and is active
		var cityExists = await dbContext
			.Cities.WhereNotDeleted<City, int>()
			.AnyAsync(c => c.Id == request.CityId && c.IsActive, ct);

		if (!cityExists)
			return Result<int>.Failure(L(LocalizationKeys.PetAd.CityNotFound), 404);

		// Verify district exists, belongs to city, and is active (if provided)
		if (request.DistrictId.HasValue)
		{
			var districtExists = await dbContext
				.Districts.WhereNotDeleted<District, int>()
				.AnyAsync(d => d.Id == request.DistrictId.Value && d.CityId == request.CityId && d.IsActive, ct);

			if (!districtExists)
				return Result<int>.Failure(L(LocalizationKeys.PetAd.DistrictNotFound), 404);
		}

		// Calculate expiration date (e.g., 30 days from now)
		var expiresAt = DateTime.UtcNow.AddDays(30);

		// Create the pet ad with Published status (admin-created ads skip review)
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
			DistrictId = request.DistrictId,
			PetBreedId = breedId,
			PetCategoryId = categoryId,
			UserId = request.UserId, // Admin specifies the user
			Status = PetAdStatus.Published, // Admin-created ads are immediately published
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

		logger.LogInformation("Admin created pet ad {AdId} for user {UserId}", petAd.Id, request.UserId);

		return Result<int>.Success(petAd.Id, 201);
	}
}
