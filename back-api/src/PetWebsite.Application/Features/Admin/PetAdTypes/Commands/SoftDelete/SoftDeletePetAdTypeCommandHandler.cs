using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Application.Extensions;
using PetWebsite.Domain.Constants;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Application.Features.Admin.PetAdTypes.Commands.SoftDelete;

public class SoftDeletePetAdTypeCommandHandler(IApplicationDbContext dbContext, IStringLocalizer localizer)
	: BaseHandler(localizer),
		ICommandHandler<SoftDeletePetAdTypeCommand, Result>
{
	public async Task<Result> Handle(SoftDeletePetAdTypeCommand request, CancellationToken ct)
	{
		var success = await dbContext.PetAdTypes.SoftDeleteByIdAsync<PetAdTypeEntity, int>(
			request.Id,
			request.DeletedBy,
			ct
		);

		if (!success)
			return Result.Failure(L(LocalizationKeys.PetAdType.NotFound), 404);

		await dbContext.SaveChangesAsync(ct);
		return Result.Success();
	}
}
