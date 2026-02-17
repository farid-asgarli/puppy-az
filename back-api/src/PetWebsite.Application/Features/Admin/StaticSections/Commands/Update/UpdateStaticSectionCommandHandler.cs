using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Constants;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Application.Features.Admin.StaticSections.Commands.Update;

public class UpdateStaticSectionCommandHandler(
	IApplicationDbContext dbContext,
	IStringLocalizer localizer
) : BaseHandler(localizer), ICommandHandler<UpdateStaticSectionCommand, Result>
{
	public async Task<Result> Handle(UpdateStaticSectionCommand request, CancellationToken ct)
	{
		var section = await dbContext
			.StaticSections.Include(s => s.Localizations)
			.ThenInclude(l => l.AppLocale)
			.FirstOrDefaultAsync(s => s.Id == request.Id, ct);

		if (section is null)
			return Result.Failure(L(LocalizationKeys.StaticSection.NotFound), 404);

		// Check if key is being changed and if new key already exists
		if (section.Key != request.Key)
		{
			var existingSection = await dbContext.StaticSections.FirstOrDefaultAsync(
				s => s.Key == request.Key && s.Id != request.Id,
				ct
			);

			if (existingSection is not null)
				return Result.Failure(L(LocalizationKeys.StaticSection.KeyAlreadyExists), 400);
		}

		// Get all locale IDs from the database
		var locales = await dbContext
			.AppLocales.Where(l =>
				request.Localizations.Select(loc => loc.LocaleCode).Contains(l.Code)
			)
			.ToListAsync(ct);

		if (locales.Count != request.Localizations.Count)
			return Result.Failure(L(LocalizationKeys.StaticSection.InvalidLocaleCode), 400);

		// Update section
		section.Key = request.Key;
		section.IsActive = request.IsActive;

		// Remove existing localizations
		dbContext.StaticSectionLocalizations.RemoveRange(section.Localizations);

		// Add new localizations
		foreach (var locDto in request.Localizations)
		{
			var locale = locales.First(l => l.Code == locDto.LocaleCode);
			section.Localizations.Add(
				new StaticSectionLocalization
				{
					AppLocaleId = locale.Id,
					Title = locDto.Title,
					Subtitle = locDto.Subtitle,
					Content = locDto.Content,
					Metadata = locDto.Metadata,
				}
			);
		}

		await dbContext.SaveChangesAsync(ct);

		return Result.Success();
	}
}
