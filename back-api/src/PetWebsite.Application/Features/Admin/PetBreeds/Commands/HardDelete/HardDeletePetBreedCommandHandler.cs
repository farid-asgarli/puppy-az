using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Constants;

namespace PetWebsite.Application.Features.Admin.PetBreeds.Commands.HardDelete;

public class HardDeletePetBreedCommandHandler(IApplicationDbContext dbContext, IStringLocalizer localizer)
	: BaseHandler(localizer),
		ICommandHandler<HardDeletePetBreedCommand, Result>
{
	public async Task<Result> Handle(HardDeletePetBreedCommand request, CancellationToken ct)
	{
		var breed = await dbContext.PetBreeds.Include(b => b.PetAds).FirstOrDefaultAsync(b => b.Id == request.Id, ct);

		if (breed == null)
			return Result.Failure(L(LocalizationKeys.PetBreed.NotFound), 404);

		// Check if breed has any pet ads
		if (breed.PetAds.Count != 0)
			return Result.Failure(L(LocalizationKeys.PetBreed.CannotDeleteWithPetAds), 400);

		dbContext.PetBreeds.Remove(breed);
		await dbContext.SaveChangesAsync(ct);

		return Result.Success();
	}
}
