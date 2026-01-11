using Common.Repository.Abstraction;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Application.Extensions;
using PetWebsite.Domain.Constants;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Application.Features.PetAds.Queries.GetPetAdQuestions;

public class GetPetAdQuestionsQueryHandler(IApplicationDbContext dbContext, IDynamicQueryRepository queryRepo, IStringLocalizer localizer)
	: BaseHandler(localizer),
		IQueryHandler<GetPetAdQuestionsQuery, Result<PaginatedResult<PetAdQuestionDto>>>
{
	public async Task<Result<PaginatedResult<PetAdQuestionDto>>> Handle(GetPetAdQuestionsQuery request, CancellationToken ct)
	{
		// Check if the pet ad exists and is not deleted
		var adExists = await dbContext.PetAds.WhereNotDeleted<PetAd, int>().AnyAsync(p => p.Id == request.PetAdId, ct);

		if (!adExists)
			return Result<PaginatedResult<PetAdQuestionDto>>.Failure(L(LocalizationKeys.PetAd.NotFound), 404);

		// Get questions for the ad
		var query = dbContext
			.PetAdQuestions.Where(q => q.PetAdId == request.PetAdId && !q.IsDeleted)
			.AsNoTracking()
			.Include(q => q.User)
			.OrderByDescending(q => q.CreatedAt)
			.Select(q => new PetAdQuestionDto
			{
				Id = q.Id,
				Question = q.Question,
				Answer = q.Answer,
				QuestionerName = q.User.FirstName + " " + q.User.LastName,
				AskedAt = q.CreatedAt,
				AnsweredAt = q.AnsweredAt,
			});

		var (items, totalCount) = await queryRepo.WithQuery(query).ApplyPagination(request.Pagination).ToListWithCountAsync(ct);

		return Result<PaginatedResult<PetAdQuestionDto>>.Success(
			new PaginatedResult<PetAdQuestionDto>
			{
				Items = items,
				TotalCount = totalCount,
				PageNumber = request.Pagination?.Number ?? 1,
				PageSize = request.Pagination?.Size ?? 10,
			}
		);
	}
}
