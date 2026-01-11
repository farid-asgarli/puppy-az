using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Application.Extensions;
using PetWebsite.Domain.Constants;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Application.Features.Admin.Cities.Commands.Restore;

public class RestoreCityCommandHandler(IApplicationDbContext dbContext, IStringLocalizer localizer)
	: BaseHandler(localizer),
		ICommandHandler<RestoreCityCommand, Result>
{
	public async Task<Result> Handle(RestoreCityCommand request, CancellationToken ct)
	{
		var success = await dbContext.Cities.RestoreByIdAsync<City, int>(request.Id, ct);

		if (!success)
			return Result.Failure(L(LocalizationKeys.City.NotFound), 404);

		return Result.Success();
	}
}
