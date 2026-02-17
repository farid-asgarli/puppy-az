using Common.Repository.Abstraction;
using Microsoft.EntityFrameworkCore;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Application.Features.Admin.BreedSuggestions.Queries.ListBreedSuggestions;

public class ListBreedSuggestionsQueryHandler(
	IApplicationDbContext dbContext,
	IDynamicQueryRepository queryRepo,
	ICurrentUserService currentUserService
) : ICommandHandler<ListBreedSuggestionsQuery, PaginatedResult<BreedSuggestionListItemDto>>
{
	public async Task<PaginatedResult<BreedSuggestionListItemDto>> Handle(
		ListBreedSuggestionsQuery request, CancellationToken ct)
	{
		var currentCulture = currentUserService.CurrentCulture;

		IQueryable<BreedSuggestion> suggestionsQuery = dbContext.BreedSuggestions
			.AsNoTracking()
			.Include(s => s.Category)
				.ThenInclude(c => c.Localizations)
				.ThenInclude(l => l.AppLocale)
			.Include(s => s.User);

		// Filter by category
		if (request.PetCategoryId.HasValue)
			suggestionsQuery = suggestionsQuery.Where(s => s.PetCategoryId == request.PetCategoryId.Value);

		// Filter by status
		if (request.Status.HasValue)
			suggestionsQuery = suggestionsQuery.Where(s => (int)s.Status == request.Status.Value);

		var query =
			from suggestion in suggestionsQuery
			let categoryLocalization = suggestion.Category.Localizations
				.FirstOrDefault(l => l.AppLocale.Code == currentCulture)
				?? suggestion.Category.Localizations.FirstOrDefault(l => l.AppLocale.IsDefault)
			select new BreedSuggestionListItemDto
			{
				Id = suggestion.Id,
				Name = suggestion.Name,
				PetCategoryId = suggestion.PetCategoryId,
				CategoryTitle = categoryLocalization != null ? categoryLocalization.Title : "",
				UserId = suggestion.UserId,
				UserName = suggestion.User != null ? suggestion.User.FullName : null,
				Status = suggestion.Status,
				ApprovedBreedId = suggestion.ApprovedBreedId,
				AdminNote = suggestion.AdminNote,
				CreatedAt = suggestion.CreatedAt,
			};

		var (items, count) = await queryRepo
			.WithQuery(query)
			.ApplyFilters(request.Filter)
			.ApplySorting(request.Sorting, "CreatedAt")
			.ApplyPagination(request.Pagination)
			.ToListWithCountAsync(ct);

		return new PaginatedResult<BreedSuggestionListItemDto>
		{
			Items = items,
			TotalCount = count,
			PageNumber = request.Pagination?.Number ?? 1,
			PageSize = request.Pagination?.Size ?? count,
		};
	}
}
