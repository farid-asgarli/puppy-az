using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Application.Extensions;
using PetWebsite.Domain.Constants;

namespace PetWebsite.Application.Features.Admin.PetCategories.Commands.Restore;

public class RestorePetCategoryCommandHandler(IApplicationDbContext dbContext, IStringLocalizer localizer)
	: BaseHandler(localizer),
		ICommandHandler<RestorePetCategoryCommand, Result>
{
	public async Task<Result> Handle(RestorePetCategoryCommand request, CancellationToken ct)
	{
		// Use the restore extension on DbSet
		var restored = await dbContext.PetCategories.RestoreByIdAsync<Domain.Entities.PetCategory, int>(request.Id, ct);

		if (!restored)
			return Result.Failure(L(LocalizationKeys.PetCategory.NotFound), 404);

		await dbContext.SaveChangesAsync(ct);
		return Result.Success();
	}
}
