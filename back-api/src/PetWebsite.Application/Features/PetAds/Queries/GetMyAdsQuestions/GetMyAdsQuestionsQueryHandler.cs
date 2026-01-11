using Common.Repository.Abstraction;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Constants;

namespace PetWebsite.Application.Features.PetAds.Queries.GetMyAdsQuestions;

public class GetMyAdsQuestionsQueryHandler(
	IApplicationDbContext dbContext,
	ICurrentUserService currentUserService,
	IDynamicQueryRepository queryRepo,
	IUrlService urlService,
	IStringLocalizer localizer
) : BaseHandler(localizer), IQueryHandler<GetMyAdsQuestionsQuery, Result<PaginatedResult<MyAdQuestionDto>>>
{
	public async Task<Result<PaginatedResult<MyAdQuestionDto>>> Handle(GetMyAdsQuestionsQuery request, CancellationToken ct)
	{
		// Get current user ID
		var userId = currentUserService.UserId;
		if (userId is null)
			return Result<PaginatedResult<MyAdQuestionDto>>.Failure(L(LocalizationKeys.Error.Unauthorized), 401);

		// Build query for questions on ads owned by the current user
		var query = dbContext
			.PetAdQuestions.AsNoTracking()
			.Include(q => q.PetAd)
			.ThenInclude(p => p.Images)
			.Include(q => q.User)
			.Where(q => !q.IsDeleted && q.PetAd.UserId == userId.Value && !q.PetAd.IsDeleted);

		// Order by unanswered first, then by newest
		query = query.OrderBy(q => q.Answer != null).ThenByDescending(q => q.CreatedAt);

		// Project to DTO
		var projectedQuery = query.Select(q => new MyAdQuestionDto
		{
			QuestionId = q.Id,
			PetAdId = q.PetAdId,
			PetAdTitle = q.PetAd.Title,
			Question = q.Question,
			Answer = q.Answer,
			QuestionerName = q.User.FullName ?? q.User.UserName ?? "Unknown",
			AskedAt = q.CreatedAt,
			AnsweredAt = q.AnsweredAt,
			PrimaryImageUrl =
				"/"
				+ (
					q.PetAd.Images.Where(i => i.IsPrimary).Select(i => i.FilePath).FirstOrDefault()
					?? q.PetAd.Images.OrderBy(i => i.Id).Select(i => i.FilePath).FirstOrDefault()
					?? ""
				),
		});

		var (items, totalCount) = await queryRepo
			.WithQuery(projectedQuery)
			.ApplyFilters(request.Filter)
			.ApplyPagination(request.Pagination)
			.ToListWithCountAsync(ct);

		// Convert relative image URLs to absolute URLs
		var processedItems = items
			.Select(item =>
			{
				if (!string.IsNullOrEmpty(item.PrimaryImageUrl))
				{
					return new MyAdQuestionDto
					{
						QuestionId = item.QuestionId,
						PetAdId = item.PetAdId,
						PetAdTitle = item.PetAdTitle,
						Question = item.Question,
						Answer = item.Answer,
						QuestionerName = item.QuestionerName,
						AskedAt = item.AskedAt,
						AnsweredAt = item.AnsweredAt,
						PrimaryImageUrl = urlService.ToAbsoluteUrl(item.PrimaryImageUrl),
					};
				}
				return item;
			})
			.ToList();

		var result = new PaginatedResult<MyAdQuestionDto>
		{
			Items = processedItems,
			TotalCount = totalCount,
			PageNumber = request.Pagination?.Number ?? 1,
			PageSize = request.Pagination?.Size ?? 10,
		};

		return Result<PaginatedResult<MyAdQuestionDto>>.Success(result);
	}
}
