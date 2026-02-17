using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Application.Extensions;
using PetWebsite.Domain.Constants;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Application.Features.Admin.PetAds.Commands.AssignBreedToAd;

public class AssignBreedToAdCommandHandler(
	IApplicationDbContext dbContext,
	IStringLocalizer localizer)
	: BaseHandler(localizer),
		ICommandHandler<AssignBreedToAdCommand, Result>
{
	public async Task<Result> Handle(AssignBreedToAdCommand request, CancellationToken ct)
	{
		var petAd = await dbContext.PetAds
			.FirstOrDefaultAsync(p => p.Id == request.PetAdId && !p.IsDeleted, ct);

		if (petAd is null)
			return Result.Failure(L(LocalizationKeys.PetAd.NotFound), 404);

		var breed = await dbContext.PetBreeds
			.WhereNotDeleted<PetBreed, int>()
			.Where(b => b.Id == request.PetBreedId && b.IsActive)
			.FirstOrDefaultAsync(ct);

		if (breed is null)
			return Result.Failure(L(LocalizationKeys.PetAd.BreedNotFound), 404);

		petAd.PetBreedId = breed.Id;
		petAd.PetCategoryId = breed.PetCategoryId;
		petAd.SuggestedBreedName = null; // Clear the suggestion since breed is now assigned
		petAd.UpdatedAt = DateTime.UtcNow;

		await dbContext.SaveChangesAsync(ct);

		return Result.Success();
	}
}
