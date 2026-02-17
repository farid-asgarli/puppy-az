using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Constants;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Application.Features.Admin.BreedSuggestions.Commands.Approve;

public class ApproveBreedSuggestionCommandHandler(IApplicationDbContext dbContext, IStringLocalizer localizer)
	: BaseHandler(localizer),
		ICommandHandler<ApproveBreedSuggestionCommand, Result<int>>
{
	public async Task<Result<int>> Handle(ApproveBreedSuggestionCommand request, CancellationToken ct)
	{
		// Find the suggestion
		var suggestion = await dbContext.BreedSuggestions
			.FirstOrDefaultAsync(s => s.Id == request.SuggestionId, ct);

		if (suggestion == null)
			return Result<int>.Failure(L(LocalizationKeys.BreedSuggestion.NotFound), 404);

		if (suggestion.Status != BreedSuggestionStatus.Pending)
			return Result<int>.Failure(L(LocalizationKeys.BreedSuggestion.AlreadyProcessed));

		// Validate category exists
		var categoryExists = await dbContext.PetCategories
			.AnyAsync(c => c.Id == request.PetCategoryId && !c.IsDeleted, ct);

		if (!categoryExists)
			return Result<int>.Failure(L(LocalizationKeys.PetCategory.NotFound), 404);

		// Get all locale IDs from the database
		var locales = await dbContext.AppLocales
			.Where(l => request.Localizations.Select(loc => loc.LocaleCode).Contains(l.Code))
			.ToListAsync(ct);

		if (locales.Count != request.Localizations.Count)
			return Result<int>.Failure(L(LocalizationKeys.PetBreed.InvalidLocaleCode));

		// Create the new breed
		var breed = new PetBreed
		{
			PetCategoryId = request.PetCategoryId,
			IsActive = request.IsActive
		};

		foreach (var locDto in request.Localizations)
		{
			var locale = locales.First(l => l.Code == locDto.LocaleCode);
			breed.Localizations.Add(new PetBreedLocalization
			{
				AppLocaleId = locale.Id,
				Title = locDto.Title
			});
		}

		dbContext.PetBreeds.Add(breed);

		// Update suggestion status
		suggestion.Status = BreedSuggestionStatus.Approved;
		suggestion.ApprovedBreedId = breed.Id;

		await dbContext.SaveChangesAsync(ct);

		// Update the ApprovedBreedId after save (breed.Id is now set)
		suggestion.ApprovedBreedId = breed.Id;
		await dbContext.SaveChangesAsync(ct);

		return Result<int>.Success(breed.Id, 201);
	}
}
