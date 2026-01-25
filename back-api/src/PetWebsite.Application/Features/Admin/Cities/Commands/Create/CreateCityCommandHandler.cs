using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Constants;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Application.Features.Admin.Cities.Commands.Create;

public class CreateCityCommandHandler(IApplicationDbContext dbContext, IStringLocalizer localizer)
	: BaseHandler(localizer),
		ICommandHandler<CreateCityCommand, Result<int>>
{
	public async Task<Result<int>> Handle(CreateCityCommand request, CancellationToken ct)
	{
		// Check if city with same name already exists (check all languages)
		var existingCity = await dbContext.Cities.FirstOrDefaultAsync(
			c => c.NameAz == request.NameAz || c.NameEn == request.NameEn || c.NameRu == request.NameRu,
			ct
		);

		if (existingCity != null)
			return Result<int>.Failure(L(LocalizationKeys.City.AlreadyExists), 409);

		var city = new City
		{
			NameAz = request.NameAz,
			NameEn = request.NameEn,
			NameRu = request.NameRu,
			IsMajorCity = request.IsMajorCity,
			DisplayOrder = request.DisplayOrder,
			IsActive = request.IsActive,
		};

		dbContext.Cities.Add(city);
		await dbContext.SaveChangesAsync(ct);

		return Result<int>.Success(city.Id, 201);
	}
}
