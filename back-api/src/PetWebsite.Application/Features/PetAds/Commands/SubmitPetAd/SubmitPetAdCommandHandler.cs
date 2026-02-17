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

namespace PetWebsite.Application.Features.PetAds.Commands.SubmitPetAd;

public class SubmitPetAdCommandHandler(
	IApplicationDbContext dbContext, 
	IStringLocalizer localizer, 
	ICurrentUserService currentUserService,
	ITelegramService telegramService,
	ILogger<SubmitPetAdCommandHandler> logger)
	: BaseHandler(localizer),
		ICommandHandler<SubmitPetAdCommand, Result<int>>
{
	// Ad types where breed is optional
	private static readonly PetAdType[] OptionalBreedAdTypes = [PetAdType.Found, PetAdType.Owning];

	public async Task<Result<int>> Handle(SubmitPetAdCommand request, CancellationToken ct)
	{
		// Verify breed exists and is active (only if breed is provided)
		int? breedId = null;
		int? categoryId = request.PetCategoryId;
		string? breedName = null;

		if (request.PetBreedId.HasValue)
		{
			var breed = await dbContext
				.PetBreeds.WhereNotDeleted<PetBreed, int>()
				.Include(b => b.Localizations)
					.ThenInclude(l => l.AppLocale)
				.Where(b => b.Id == request.PetBreedId.Value && b.IsActive)
				.FirstOrDefaultAsync(ct);

			if (breed is null)
				return Result<int>.Failure(L(LocalizationKeys.PetAd.BreedNotFound), 404);

			breedId = breed.Id;
			breedName = breed.Localizations.FirstOrDefault(l => l.AppLocale.Code == "az")?.Title 
				?? breed.Localizations.FirstOrDefault()?.Title;
			// If breed is selected, use breed's category
			categoryId = breed.PetCategoryId;
		}
		else if (!OptionalBreedAdTypes.Contains(request.AdType) && string.IsNullOrWhiteSpace(request.SuggestedBreedName))
		{
			// Breed is required for Sale, Lost, and Match ad types (unless a breed suggestion is provided)
			return Result<int>.Failure(L(LocalizationKeys.PetAd.BreedRequired), 400);
		}

		// Verify category exists if provided
		string? categoryName = null;
		if (categoryId.HasValue)
		{
			var category = await dbContext
				.PetCategories.WhereNotDeleted<PetCategory, int>()
				.Include(c => c.Localizations)
					.ThenInclude(l => l.AppLocale)
				.Where(c => c.Id == categoryId.Value && c.IsActive)
				.FirstOrDefaultAsync(ct);

			if (category is null)
				return Result<int>.Failure(L(LocalizationKeys.PetAd.CategoryNotFound), 404);
			
			categoryName = category.Localizations.FirstOrDefault(l => l.AppLocale.Code == "az")?.Title 
				?? category.Localizations.FirstOrDefault()?.Title;
		}

		// Verify city exists and is active
		var city = await dbContext
			.Cities.WhereNotDeleted<City, int>()
			.Where(c => c.Id == request.CityId && c.IsActive)
			.FirstOrDefaultAsync(ct);

		if (city is null)
			return Result<int>.Failure(L(LocalizationKeys.PetAd.CityNotFound), 404);

		// Verify district exists and belongs to the city (if provided)
		if (request.DistrictId.HasValue)
		{
			var district = await dbContext
				.Districts.AsNoTracking()
				.Where(d => d.Id == request.DistrictId.Value && d.CityId == request.CityId && d.IsActive && !d.IsDeleted)
				.FirstOrDefaultAsync(ct);

			if (district is null)
				return Result<int>.Failure(L(LocalizationKeys.PetAd.DistrictNotFound), 404);
		}

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
			DistrictId = request.DistrictId,
			CustomDistrictName = string.IsNullOrWhiteSpace(request.CustomDistrictName) ? null : request.CustomDistrictName.Trim(),
			PetBreedId = breedId,
			PetCategoryId = categoryId,
			SuggestedBreedName = string.IsNullOrWhiteSpace(request.SuggestedBreedName) ? null : request.SuggestedBreedName.Trim(),
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

		// Send Telegram notification to admin
		var userPhone = await dbContext.RegularUsers
			.Where(u => u.Id == userId.Value)
			.Select(u => u.PhoneNumber)
			.FirstOrDefaultAsync(ct);
		
		logger.LogInformation("Sending Telegram notification for new ad {AdId}", petAd.Id);
		await telegramService.SendNewAdNotificationAsync(
			petAd.Id,
			petAd.Title,
			categoryName,
			breedName ?? petAd.SuggestedBreedName,
			petAd.Price,
			city.NameAz,
			userPhone,
			CancellationToken.None // Don't cancel the notification if the request is cancelled
		);

		return Result<int>.Success(petAd.Id, 201);
	}
}
