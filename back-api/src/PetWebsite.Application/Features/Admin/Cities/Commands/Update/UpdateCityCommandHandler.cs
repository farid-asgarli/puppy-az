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

		// Check if another city with same name already exists (check all languages)
		var existingCity = await dbContext.Cities.FirstOrDefaultAsync(
			c =>
				c.Id != request.Id
				&& (c.NameAz == request.NameAz || c.NameEn == request.NameEn || c.NameRu == request.NameRu),
			ct
		);

		if (existingCity != null)
			return Result.Failure(L(LocalizationKeys.City.AlreadyExists), 409);

		city.NameAz = request.NameAz;
		city.NameEn = request.NameEn;
		city.NameRu = request.NameRu;
		city.IsMajorCity = request.IsMajorCity;
		city.DisplayOrder = request.DisplayOrder;
		city.IsActive = request.IsActive;

		await dbContext.SaveChangesAsync(ct);

		return Result.Success();
	}
}
