using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Constants;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Application.Features.Admin.PetAdTypes.Commands.Update;

public class UpdatePetAdTypeCommandHandler(IApplicationDbContext dbContext, IStringLocalizer localizer)
	: BaseHandler(localizer),
		ICommandHandler<UpdatePetAdTypeCommand, Result>
{
	public async Task<Result> Handle(UpdatePetAdTypeCommand request, CancellationToken ct)
	{
		var petAdType = await dbContext.PetAdTypes
			.Include(t => t.Localizations)
			.FirstOrDefaultAsync(t => t.Id == request.Id, ct);

		if (petAdType == null)
			return Result.Failure(L(LocalizationKeys.PetAdType.NotFound), 404);

		// Check if another pet ad type with same key already exists
		var existingType = await dbContext.PetAdTypes.FirstOrDefaultAsync(
			t => t.Id != request.Id && t.Key == request.Key,
			ct
		);

		if (existingType != null)
			return Result.Failure(L(LocalizationKeys.PetAdType.AlreadyExists), 409);

		// Get all required locales
		var locales = await dbContext
			.AppLocales.Where(l => new[] { "az", "en", "ru" }.Contains(l.Code))
			.ToListAsync(ct);

		if (locales.Count != 3)
			return Result.Failure(L(LocalizationKeys.PetAdType.InvalidLocaleCode));

		// Update main properties
		petAdType.Key = request.Key;
		petAdType.Emoji = request.Emoji;
		petAdType.IconName = request.IconName;
		petAdType.BackgroundColor = request.BackgroundColor;
		petAdType.TextColor = request.TextColor;
		petAdType.BorderColor = request.BorderColor;
		petAdType.SortOrder = request.SortOrder;
		petAdType.IsActive = request.IsActive;

		// Update localizations
		var azLocale = locales.First(l => l.Code == "az");
		var enLocale = locales.First(l => l.Code == "en");
		var ruLocale = locales.First(l => l.Code == "ru");

		UpdateOrAddLocalization(petAdType, azLocale.Id, request.TitleAz, request.DescriptionAz);
		UpdateOrAddLocalization(petAdType, enLocale.Id, request.TitleEn, request.DescriptionEn);
		UpdateOrAddLocalization(petAdType, ruLocale.Id, request.TitleRu, request.DescriptionRu);

		await dbContext.SaveChangesAsync(ct);

		return Result.Success();
	}

	private static void UpdateOrAddLocalization(
		PetAdTypeEntity petAdType,
		int localeId,
		string title,
		string? description)
	{
		var localization = petAdType.Localizations.FirstOrDefault(l => l.AppLocaleId == localeId);

		if (localization != null)
		{
			localization.Title = title;
			localization.Description = description;
		}
		else
		{
			petAdType.Localizations.Add(new PetAdTypeLocalization
			{
				AppLocaleId = localeId,
				Title = title,
				Description = description,
			});
		}
	}
}
