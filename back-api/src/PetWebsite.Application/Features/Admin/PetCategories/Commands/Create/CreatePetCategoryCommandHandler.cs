using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Constants;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Application.Features.Admin.PetCategories.Commands.Create;

public class CreatePetCategoryCommandHandler(IApplicationDbContext dbContext, IStringLocalizer localizer)
	: BaseHandler(localizer),
		ICommandHandler<CreatePetCategoryCommand, Result<int>>
{
	public async Task<Result<int>> Handle(CreatePetCategoryCommand request, CancellationToken ct)
	{
		// Get all locale IDs from the database
		var locales = await dbContext
			.AppLocales.Where(l => request.Localizations.Select(loc => loc.LocaleCode).Contains(l.Code))
			.ToListAsync(ct);

		if (locales.Count != request.Localizations.Count)
			return Result<int>.Failure(L(LocalizationKeys.PetCategory.InvalidLocaleCode));

		var category = new PetCategory
		{
			SvgIcon = request.SvgIcon,
			IconColor = request.IconColor,
			BackgroundColor = request.BackgroundColor,
			IsActive = request.IsActive,
		};

		// Add localizations
		foreach (var locDto in request.Localizations)
		{
			var locale = locales.First(l => l.Code == locDto.LocaleCode);
			category.Localizations.Add(
				new PetCategoryLocalization
				{
					AppLocaleId = locale.Id,
					Title = locDto.Title,
					Subtitle = locDto.Subtitle,
				}
			);
		}

		dbContext.PetCategories.Add(category);
		await dbContext.SaveChangesAsync(ct);

		return Result<int>.Success(category.Id, 201);
	}
}
