using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Constants;

namespace PetWebsite.Application.Features.Admin.PetCategories.Commands.HardDelete;

public class HardDeletePetCategoryCommandHandler(IApplicationDbContext dbContext, IStringLocalizer localizer)
	: BaseHandler(localizer),
		ICommandHandler<HardDeletePetCategoryCommand, Result>
{
	public async Task<Result> Handle(HardDeletePetCategoryCommand request, CancellationToken ct)
	{
		var category = await dbContext.PetCategories.Include(c => c.Breeds).FirstOrDefaultAsync(c => c.Id == request.Id, ct);

		if (category == null)
			return Result.Failure(L(LocalizationKeys.PetCategory.NotFound), 404);

		// Check if category has any breeds
		if (category.Breeds.Count != 0)
			return Result.Failure(L(LocalizationKeys.PetCategory.CannotDeleteWithBreeds), 400);

		dbContext.PetCategories.Remove(category);
		await dbContext.SaveChangesAsync(ct);

		return Result.Success();
	}
}
