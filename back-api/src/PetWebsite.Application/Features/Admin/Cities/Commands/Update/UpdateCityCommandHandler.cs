using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Constants;

namespace PetWebsite.Application.Features.Admin.Cities.Commands.Update;

public class UpdateCityCommandHandler(IApplicationDbContext dbContext, IStringLocalizer localizer)
	: BaseHandler(localizer),
		ICommandHandler<UpdateCityCommand, Result>
{
	public async Task<Result> Handle(UpdateCityCommand request, CancellationToken ct)
	{
		var city = await dbContext.Cities.FirstOrDefaultAsync(c => c.Id == request.Id, ct);

		if (city == null)
			return Result.Failure(L(LocalizationKeys.City.NotFound), 404);

		// Check if another city with same name already exists
		var existingCity = await dbContext.Cities.FirstOrDefaultAsync(c => c.Name == request.Name && c.Id != request.Id, ct);

		if (existingCity != null)
			return Result.Failure(L(LocalizationKeys.City.AlreadyExists), 409);

		city.Name = request.Name;
		city.IsActive = request.IsActive;

		await dbContext.SaveChangesAsync(ct);

		return Result.Success();
	}
}
