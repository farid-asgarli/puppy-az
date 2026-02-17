using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Constants;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Application.Features.Admin.StaticSections.Commands.Create;

public class CreateStaticSectionCommandHandler(
	IApplicationDbContext dbContext,
	IStringLocalizer localizer
) : BaseHandler(localizer), ICommandHandler<CreateStaticSectionCommand, Result<int>>
{
	public async Task<Result<int>> Handle(CreateStaticSectionCommand request, CancellationToken ct)
	{
		// Check if key already exists
		var existingSection = await dbContext.StaticSections.FirstOrDefaultAsync(
			s => s.Key == request.Key,
			ct
		);

		if (existingSection is not null)
			return Result<int>.Failure(L(LocalizationKeys.StaticSection.KeyAlreadyExists), 400);

		// Get all locale IDs from the database
		var locales = await dbContext
			.AppLocales.Where(l =>
				request.Localizations.Select(loc => loc.LocaleCode).Contains(l.Code)
			)
			.ToListAsync(ct);

		if (locales.Count != request.Localizations.Count)
			return Result<int>.Failure(L(LocalizationKeys.StaticSection.InvalidLocaleCode), 400);

		var section = new StaticSection { Key = request.Key, IsActive = request.IsActive };

		// Add localizations
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

		dbContext.StaticSections.Add(section);
		await dbContext.SaveChangesAsync(ct);

		return Result<int>.Success(section.Id, 201);
	}
}
