using Microsoft.AspNetCore.Identity;
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

public class AskQuestionCommandHandler(IApplicationDbContext dbContext, ICurrentUserService currentUserService, UserManager<User> userManager, IStringLocalizer localizer)
	: BaseHandler(localizer),
		ICommandHandler<AskQuestionCommand, Result<AskQuestionResultDto>>
{
	public async Task<Result<AskQuestionResultDto>> Handle(AskQuestionCommand request, CancellationToken ct)
	{
		var userId = currentUserService.UserId;
		if (userId == null)
			return Result<AskQuestionResultDto>.Failure(L(LocalizationKeys.Error.Unauthorized), 401);

		// Check if the pet ad exists, is not deleted, and is published
		var petAd = await dbContext.PetAds.WhereNotDeleted<PetAd, int>().FirstOrDefaultAsync(p => p.Id == request.PetAdId, ct);

		if (petAd == null)
			return Result<AskQuestionResultDto>.Failure(L(LocalizationKeys.PetAd.NotFound), 404);

		if (petAd.Status != PetAdStatus.Published)
			return Result<AskQuestionResultDto>.Failure(L(LocalizationKeys.PetAd.CannotAskQuestionOnUnpublishedAd), 400);

		// Check if user is asking a question on their own ad
		if (petAd.UserId == userId)
			return Result<AskQuestionResultDto>.Failure(L(LocalizationKeys.PetAd.CannotAskQuestionOnOwnAd), 400);

		// Create the question
		var question = new PetAdQuestion
		{
			PetAdId = request.PetAdId,
			UserId = userId.Value,
			Question = request.Question.Trim(),
		};

		dbContext.PetAdQuestions.Add(question);
		await dbContext.SaveChangesAsync(ct);

		// Get questioner name from UserManager
		var questioner = await userManager.FindByIdAsync(userId.Value.ToString());
		var questionerName = questioner?.FirstName ?? questioner?.Email ?? "İstifadəçi";

		return Result<AskQuestionResultDto>.Success(new AskQuestionResultDto
		{
			QuestionId = question.Id,
			OwnerId = petAd.UserId!.Value,
			PetAdTitle = petAd.Title,
			QuestionerName = questionerName,
			QuestionText = request.Question.Trim()
		});
	}
}
