using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Application.Extensions;
using PetWebsite.Domain.Constants;

namespace PetWebsite.Application.Features.Admin.PetBreeds.Commands.SoftDelete;

public class SoftDeletePetBreedCommandHandler(IApplicationDbContext dbContext, IStringLocalizer localizer)
	: BaseHandler(localizer),
		ICommandHandler<SoftDeletePetBreedCommand, Result>
{
	public async Task<Result> Handle(SoftDeletePetBreedCommand request, CancellationToken ct)
	{
		// Use the soft delete extension on DbSet
		var deleted = await dbContext.PetBreeds.SoftDeleteByIdAsync<Domain.Entities.PetBreed, int>(request.Id, request.DeletedBy, ct);

		if (!deleted)
			return Result.Failure(L(LocalizationKeys.PetBreed.NotFound), 404);

		await dbContext.SaveChangesAsync(ct);
		return Result.Success();
	}
}
