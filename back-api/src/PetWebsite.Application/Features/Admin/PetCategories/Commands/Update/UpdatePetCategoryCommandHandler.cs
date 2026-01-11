using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Constants;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Application.Features.Admin.PetCategories.Commands.Update;

public class UpdatePetCategoryCommandHandler(IApplicationDbContext dbContext, IStringLocalizer localizer)
	: BaseHandler(localizer),
		ICommandHandler<UpdatePetCategoryCommand, Result>
{
	public async Task<Result> Handle(UpdatePetCategoryCommand request, CancellationToken ct)
	{
		var category = await dbContext.PetCategories.Include(c => c.Localizations).FirstOrDefaultAsync(c => c.Id == request.Id, ct);

		if (category == null)
			return Result.Failure(L(LocalizationKeys.PetCategory.NotFound), 404);

		// Get all locale IDs from the database
		var locales = await dbContext
			.AppLocales.Where(l => request.Localizations.Select(loc => loc.LocaleCode).Contains(l.Code))
			.ToListAsync(ct);

		if (locales.Count != request.Localizations.Count)
			return Result.Failure(L(LocalizationKeys.PetCategory.InvalidLocaleCode));

		category.SvgIcon = request.SvgIcon;
		category.IconColor = request.IconColor;
		category.BackgroundColor = request.BackgroundColor;
		category.IsActive = request.IsActive;

		// Update localizations
		// Remove existing localizations that are not in the request
		var localizationsToRemove = category.Localizations.Where(l => !request.Localizations.Any(rl => rl.Id == l.Id)).ToList();

		foreach (var loc in localizationsToRemove)
		{
			category.Localizations.Remove(loc);
		}

		// Update or add localizations
		foreach (var locDto in request.Localizations)
		{
			var locale = locales.First(l => l.Code == locDto.LocaleCode);

			if (locDto.Id.HasValue)
			{
				// Update existing localization
				var existingLoc = category.Localizations.FirstOrDefault(l => l.Id == locDto.Id.Value);
				if (existingLoc != null)
				{
					existingLoc.AppLocaleId = locale.Id;
					existingLoc.Title = locDto.Title;
					existingLoc.Subtitle = locDto.Subtitle;
				}
			}
			else
			{
				// Add new localization
				category.Localizations.Add(
					new PetCategoryLocalization
					{
						AppLocaleId = locale.Id,
						Title = locDto.Title,
						Subtitle = locDto.Subtitle,
					}
				);
			}
		}

		await dbContext.SaveChangesAsync(ct);

		return Result.Success();
	}
}
