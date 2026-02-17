using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Constants;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Application.Features.PetAds.Commands.SuggestBreed;

public class SuggestBreedCommandHandler(
	IApplicationDbContext dbContext,
	IStringLocalizer localizer,
	ICurrentUserService currentUserService)
	: BaseHandler(localizer),
		ICommandHandler<SuggestBreedCommand, Result<int>>
{
	public async Task<Result<int>> Handle(SuggestBreedCommand request, CancellationToken ct)
	{
		// Validate category exists
		var categoryExists = await dbContext.PetCategories
			.AnyAsync(c => c.Id == request.PetCategoryId && !c.IsDeleted, ct);

		if (!categoryExists)
			return Result<int>.Failure(L(LocalizationKeys.PetCategory.NotFound), 404);

		// Check for duplicate pending suggestion with the same name and category
		var duplicateExists = await dbContext.BreedSuggestions
			.AnyAsync(s => s.Name.ToLower() == request.Name.Trim().ToLower()
				&& s.PetCategoryId == request.PetCategoryId
				&& s.Status == BreedSuggestionStatus.Pending, ct);

		if (duplicateExists)
			return Result<int>.Failure(L(LocalizationKeys.BreedSuggestion.AlreadySuggested));

		var suggestion = new BreedSuggestion
		{
			Name = request.Name.Trim(),
			PetCategoryId = request.PetCategoryId,
			UserId = currentUserService.UserId,
			Status = BreedSuggestionStatus.Pending
		};

		dbContext.BreedSuggestions.Add(suggestion);
		await dbContext.SaveChangesAsync(ct);

		return Result<int>.Success(suggestion.Id, 201);
	}
}
