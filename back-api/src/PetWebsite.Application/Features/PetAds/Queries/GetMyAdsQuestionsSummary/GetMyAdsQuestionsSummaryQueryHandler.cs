using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Application.Extensions;
using PetWebsite.Domain.Constants;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Application.Features.PetAds.Queries.GetMyAdsQuestionsSummary;

public class GetMyAdsQuestionsSummaryQueryHandler(
	IApplicationDbContext dbContext,
	ICurrentUserService currentUserService,
	IStringLocalizer localizer
) : BaseHandler(localizer), IQueryHandler<GetMyAdsQuestionsSummaryQuery, Result<MyAdsQuestionsSummaryDto>>
{
	public async Task<Result<MyAdsQuestionsSummaryDto>> Handle(GetMyAdsQuestionsSummaryQuery request, CancellationToken ct)
	{
		// Get current user ID
		var userId = currentUserService.UserId;
		if (userId is null)
			return Result<MyAdsQuestionsSummaryDto>.Failure(L(LocalizationKeys.Error.Unauthorized), 401);

		// Get all questions on user's ads
		var questionsQuery = dbContext
			.PetAdQuestions.AsNoTracking()
			.Where(q => !q.IsDeleted && q.PetAd.UserId == userId.Value && !q.PetAd.IsDeleted);

		var totalQuestions = await questionsQuery.CountAsync(ct);
		var unansweredQuestions = await questionsQuery.Where(q => q.Answer == null).CountAsync(ct);

		var adsWithUnansweredQuestions = await questionsQuery.Where(q => q.Answer == null).Select(q => q.PetAdId).Distinct().CountAsync(ct);

		var latestUnansweredQuestion = await questionsQuery
			.Where(q => q.Answer == null)
			.OrderByDescending(q => q.CreatedAt)
			.Select(q => (DateTime?)q.CreatedAt)
			.FirstOrDefaultAsync(ct);

		var summary = new MyAdsQuestionsSummaryDto
		{
			TotalQuestions = totalQuestions,
			UnansweredQuestions = unansweredQuestions,
			AdsWithUnansweredQuestions = adsWithUnansweredQuestions,
			LatestUnansweredQuestionAt = latestUnansweredQuestion,
		};

		return Result<MyAdsQuestionsSummaryDto>.Success(summary);
	}
}
