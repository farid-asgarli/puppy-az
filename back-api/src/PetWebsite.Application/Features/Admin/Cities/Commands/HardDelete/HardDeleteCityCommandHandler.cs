using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Constants;

namespace PetWebsite.Application.Features.Admin.Cities.Commands.HardDelete;

public class HardDeleteCityCommandHandler(IApplicationDbContext dbContext, IStringLocalizer localizer)
	: BaseHandler(localizer),
		ICommandHandler<HardDeleteCityCommand, Result>
{
	public async Task<Result> Handle(HardDeleteCityCommand request, CancellationToken ct)
	{
		var city = await dbContext.Cities.Include(c => c.PetAds).FirstOrDefaultAsync(c => c.Id == request.Id, ct);

		if (city == null)
			return Result.Failure(L(LocalizationKeys.City.NotFound), 404);

		// Check if city has any pet ads
		if (city.PetAds.Count != 0)
			return Result.Failure(L(LocalizationKeys.City.CannotDeleteWithPetAds), 400);

		dbContext.Cities.Remove(city);
		await dbContext.SaveChangesAsync(ct);

		return Result.Success();
	}
}
