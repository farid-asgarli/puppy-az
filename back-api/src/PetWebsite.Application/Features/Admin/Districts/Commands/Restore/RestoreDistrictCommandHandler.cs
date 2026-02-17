using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Application.Extensions;
using PetWebsite.Domain.Constants;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Application.Features.Admin.Districts.Commands.Restore;

public class RestoreDistrictCommandHandler(IApplicationDbContext dbContext, IStringLocalizer localizer)
	: BaseHandler(localizer),
		ICommandHandler<RestoreDistrictCommand, Result>
{
	public async Task<Result> Handle(RestoreDistrictCommand request, CancellationToken ct)
	{
		var success = await dbContext.Districts.RestoreByIdAsync<District, int>(request.Id, ct);

		if (!success)
			return Result.Failure(L(LocalizationKeys.District.NotFound), 404);

		return Result.Success();
	}
}
