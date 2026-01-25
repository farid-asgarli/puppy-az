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

		// Check if ad can be edited (must be Pending, Rejected or Draft)
		if (petAd.Status != PetAdStatus.Pending && petAd.Status != PetAdStatus.Rejected && petAd.Status != PetAdStatus.Draft)
			return Result.Failure(L(LocalizationKeys.PetAd.CannotEditPublishedAd), 400);

		// Verify breed exists and is active
		var breed = await dbContext
			.PetBreeds.WhereNotDeleted<PetBreed, int>()
			.Where(b => b.Id == request.PetBreedId && b.IsActive)
			.FirstOrDefaultAsync(ct);

		if (breed is null)
			return Result.Failure(L(LocalizationKeys.PetAd.BreedNotFound), 404);

		// Verify city exists and is active
		var city = await dbContext
			.Cities.WhereNotDeleted<City, int>()
			.Where(c => c.Id == request.CityId && c.IsActive)
			.FirstOrDefaultAsync(ct);

		if (city is null)
			return Result.Failure(L(LocalizationKeys.PetAd.CityNotFound), 404);

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
		petAd.PetBreedId = request.PetBreedId;

		// Reset status to Pending for re-review
		petAd.Status = PetAdStatus.Pending;
		petAd.RejectionReason = null;

		// Handle images if provided
		if (request.ImageIds is not null && request.ImageIds.Count > 0)
		{
			// Remove all current images
			petAd.Images.Clear();

			// Fetch images that match the provided IDs and are not yet linked to any ad
			var images = await dbContext.PetAdImages.Where(img => request.ImageIds.Contains(img.Id) && img.PetAdId == null).ToListAsync(ct);

			// Security check: Verify all images belong to the current user
			if (images.Any(img => img.UploadedById != userId.Value))
				return Result.Failure(L(LocalizationKeys.PetAd.ImagesMustBeOwnedByUser), 403);

			// Verify we found all requested images
			if (images.Count != request.ImageIds.Count)
				return Result.Failure(L(LocalizationKeys.PetAd.ImageNotFound), 404);

			// Attach images to the pet ad
			if (images.Count > 0)
			{
				var isFirst = true;
				foreach (var image in images)
				{
					image.PetAdId = petAd.Id;
					image.IsPrimary = isFirst;
					image.AttachedAt = DateTime.UtcNow;
					isFirst = false;
				}
				petAd.Images = images;
			}
		}

		petAd.UpdatedAt = DateTime.UtcNow;

		await dbContext.SaveChangesAsync(ct);

		return Result.Success();
	}
}
