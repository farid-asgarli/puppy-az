using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Application.Extensions;
using PetWebsite.Domain.Constants;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Application.Features.Admin.PetAdTypes.Commands.Restore;

public class RestorePetAdTypeCommandHandler(IApplicationDbContext dbContext, IStringLocalizer localizer)
	: BaseHandler(localizer),
		ICommandHandler<RestorePetAdTypeCommand, Result>
{
	public async Task<Result> Handle(RestorePetAdTypeCommand request, CancellationToken ct)
	{
		var success = await dbContext.PetAdTypes.RestoreByIdAsync<PetAdTypeEntity, int>(request.Id, ct);

		if (!success)
			return Result.Failure(L(LocalizationKeys.PetAdType.NotFound), 404);

		await dbContext.SaveChangesAsync(ct);
		return Result.Success();
	}
}
