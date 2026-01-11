using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Application.Extensions;
using PetWebsite.Domain.Constants;

namespace PetWebsite.Application.Features.Admin.PetBreeds.Commands.Restore;

public class RestorePetBreedCommandHandler(IApplicationDbContext dbContext, IStringLocalizer localizer)
	: BaseHandler(localizer),
		ICommandHandler<RestorePetBreedCommand, Result>
{
	public async Task<Result> Handle(RestorePetBreedCommand request, CancellationToken ct)
	{
		// Use the restore extension on DbSet
		var restored = await dbContext.PetBreeds.RestoreByIdAsync(request.Id, ct);

		if (!restored)
			return Result.Failure(L(LocalizationKeys.PetBreed.NotFound), 404);

		await dbContext.SaveChangesAsync(ct);
		return Result.Success();
	}
}
