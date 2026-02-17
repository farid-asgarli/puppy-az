using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Constants;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Application.Features.Admin.PetAdTypes.Commands.Create;

public class CreatePetAdTypeCommandHandler(IApplicationDbContext dbContext, IStringLocalizer localizer)
	: BaseHandler(localizer),
		ICommandHandler<CreatePetAdTypeCommand, Result<int>>
{
	public async Task<Result<int>> Handle(CreatePetAdTypeCommand request, CancellationToken ct)
	{
		// Check if pet ad type with same key already exists
		var existingType = await dbContext.PetAdTypes.FirstOrDefaultAsync(
			t => t.Key == request.Key,
			ct
		);

		if (existingType != null)
			return Result<int>.Failure(L(LocalizationKeys.PetAdType.AlreadyExists), 409);

		// Get all required locales
		var locales = await dbContext
			.AppLocales.Where(l => new[] { "az", "en", "ru" }.Contains(l.Code))
			.ToListAsync(ct);

		if (locales.Count != 3)
			return Result<int>.Failure(L(LocalizationKeys.PetAdType.InvalidLocaleCode));

		var petAdType = new PetAdTypeEntity
		{
			Key = request.Key,
			Emoji = request.Emoji,
			IconName = request.IconName,
			BackgroundColor = request.BackgroundColor,
			TextColor = request.TextColor,
			BorderColor = request.BorderColor,
			SortOrder = request.SortOrder,
			IsActive = request.IsActive,
		};

		// Add localizations
		var azLocale = locales.First(l => l.Code == "az");
		var enLocale = locales.First(l => l.Code == "en");
		var ruLocale = locales.First(l => l.Code == "ru");

		petAdType.Localizations.Add(new PetAdTypeLocalization
		{
			AppLocaleId = azLocale.Id,
			Title = request.TitleAz,
			Description = request.DescriptionAz,
		});

		petAdType.Localizations.Add(new PetAdTypeLocalization
		{
			AppLocaleId = enLocale.Id,
			Title = request.TitleEn,
			Description = request.DescriptionEn,
		});

		petAdType.Localizations.Add(new PetAdTypeLocalization
		{
			AppLocaleId = ruLocale.Id,
			Title = request.TitleRu,
			Description = request.DescriptionRu,
		});

		dbContext.PetAdTypes.Add(petAdType);
		await dbContext.SaveChangesAsync(ct);

		return Result<int>.Success(petAdType.Id, 201);
	}
}
