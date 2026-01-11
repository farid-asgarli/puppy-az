using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Application.Extensions;
using PetWebsite.Domain.Constants;

namespace PetWebsite.Application.Features.Admin.PetCategories.Commands.SoftDelete;

public class SoftDeletePetCategoryCommandHandler(IApplicationDbContext dbContext, IStringLocalizer localizer)
	: BaseHandler(localizer),
		ICommandHandler<SoftDeletePetCategoryCommand, Result>
{
	public async Task<Result> Handle(SoftDeletePetCategoryCommand request, CancellationToken ct)
	{
		// Use the soft delete extension on DbSet
		var deleted = await dbContext.PetCategories.SoftDeleteByIdAsync<Domain.Entities.PetCategory, int>(
			request.Id,
			request.DeletedBy,
			ct
		);

		if (!deleted)
			return Result.Failure(L(LocalizationKeys.PetCategory.NotFound), 404);

		await dbContext.SaveChangesAsync(ct);
		return Result.Success();
	}
}
