using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Application.Extensions;
using PetWebsite.Domain.Constants;
using PetWebsite.Domain.Entities;
using PetWebsite.Domain.Enums;

namespace PetWebsite.Application.Features.PetAds.Commands.AskQuestion;

public class AskQuestionCommandHandler(IApplicationDbContext dbContext, ICurrentUserService currentUserService, IStringLocalizer localizer)
	: BaseHandler(localizer),
		ICommandHandler<AskQuestionCommand, Result>
{
	public async Task<Result> Handle(AskQuestionCommand request, CancellationToken ct)
	{
		var userId = currentUserService.UserId;
		if (userId == null)
			return Result.Failure(L(LocalizationKeys.Error.Unauthorized), 401);

		// Check if the pet ad exists, is not deleted, and is published
		var petAd = await dbContext.PetAds.WhereNotDeleted<PetAd, int>().FirstOrDefaultAsync(p => p.Id == request.PetAdId, ct);

		if (petAd == null)
			return Result.Failure(L(LocalizationKeys.PetAd.NotFound), 404);

		if (petAd.Status != PetAdStatus.Published)
			return Result.Failure(L(LocalizationKeys.PetAd.CannotAskQuestionOnUnpublishedAd), 400);

		// Check if user is asking a question on their own ad
		if (petAd.UserId == userId)
			return Result.Failure(L(LocalizationKeys.PetAd.CannotAskQuestionOnOwnAd), 400);

		// Create the question
		var question = new PetAdQuestion
		{
			PetAdId = request.PetAdId,
			UserId = userId.Value,
			Question = request.Question.Trim(),
		};

		dbContext.PetAdQuestions.Add(question);
		await dbContext.SaveChangesAsync(ct);

		return Result.Success();
	}
}
