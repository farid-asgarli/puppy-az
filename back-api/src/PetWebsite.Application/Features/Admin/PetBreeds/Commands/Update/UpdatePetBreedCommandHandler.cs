using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Constants;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Application.Features.Admin.PetBreeds.Commands.Update;

public class UpdatePetBreedCommandHandler(IApplicationDbContext dbContext, IStringLocalizer localizer)
	: BaseHandler(localizer),
		ICommandHandler<UpdatePetBreedCommand, Result>
{
	public async Task<Result> Handle(UpdatePetBreedCommand request, CancellationToken ct)
	{
		var breed = await dbContext.PetBreeds.Include(b => b.Localizations).FirstOrDefaultAsync(b => b.Id == request.Id, ct);

		if (breed == null)
			return Result.Failure(L(LocalizationKeys.PetBreed.NotFound), 404);

		// Validate category exists
		var categoryExists = await dbContext.PetCategories.AnyAsync(c => c.Id == request.PetCategoryId && !c.IsDeleted, ct);
		if (!categoryExists)
			return Result.Failure(L(LocalizationKeys.PetCategory.NotFound), 404);

		// Get all locale IDs from the database
		var locales = await dbContext
			.AppLocales.Where(l => request.Localizations.Select(loc => loc.LocaleCode).Contains(l.Code))
			.ToListAsync(ct);

		if (locales.Count != request.Localizations.Count)
			return Result.Failure(L(LocalizationKeys.PetBreed.InvalidLocaleCode));

		breed.PetCategoryId = request.PetCategoryId;
		breed.IsActive = request.IsActive;

		// Update localizations
		// Remove existing localizations that are not in the request
		var localizationsToRemove = breed.Localizations.Where(l => !request.Localizations.Any(rl => rl.Id == l.Id)).ToList();

		foreach (var loc in localizationsToRemove)
		{
			breed.Localizations.Remove(loc);
		}

		// Update or add localizations
		foreach (var locDto in request.Localizations)
		{
			var locale = locales.First(l => l.Code == locDto.LocaleCode);

			if (locDto.Id.HasValue)
			{
				// Update existing localization
				var existingLoc = breed.Localizations.FirstOrDefault(l => l.Id == locDto.Id.Value);
				if (existingLoc != null)
				{
					existingLoc.AppLocaleId = locale.Id;
					existingLoc.Title = locDto.Title;
				}
			}
			else
			{
				// Add new localization
				breed.Localizations.Add(new PetBreedLocalization { AppLocaleId = locale.Id, Title = locDto.Title });
			}
		}

		await dbContext.SaveChangesAsync(ct);

		return Result.Success();
	}
}
