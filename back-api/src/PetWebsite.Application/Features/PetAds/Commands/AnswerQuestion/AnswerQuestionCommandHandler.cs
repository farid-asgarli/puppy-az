using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Constants;

namespace PetWebsite.Application.Features.PetAds.Commands.AnswerQuestion;

public class AnswerQuestionCommandHandler(
	IApplicationDbContext dbContext,
	ICurrentUserService currentUserService,
	IStringLocalizer localizer
) : BaseHandler(localizer), ICommandHandler<AnswerQuestionCommand, Result<AnswerQuestionResultDto>>
{
	public async Task<Result<AnswerQuestionResultDto>> Handle(AnswerQuestionCommand request, CancellationToken ct)
	{
		var userId = currentUserService.UserId;
		if (userId == null)
			return Result<AnswerQuestionResultDto>.Failure(L(LocalizationKeys.Error.Unauthorized), 401);

		// Get the question with the pet ad
		var question = await dbContext
			.PetAdQuestions.Include(q => q.PetAd)
			.FirstOrDefaultAsync(q => q.Id == request.QuestionId && !q.IsDeleted, ct);

		if (question == null)
			return Result<AnswerQuestionResultDto>.Failure(L(LocalizationKeys.PetAd.QuestionNotFound), 404);

		// Check if the current user is the ad owner or the question asker
		if (question.PetAd.UserId != userId && question.UserId != userId)
			return Result<AnswerQuestionResultDto>.Failure(L(LocalizationKeys.PetAd.OnlyAdOwnerCanAnswer), 403);

		// Check if question is already answered
		if (question.Answer != null)
			return Result<AnswerQuestionResultDto>.Failure(L(LocalizationKeys.PetAd.QuestionAlreadyAnswered), 400);

		// Update the answer
		question.Answer = request.Answer.Trim();
		question.AnsweredAt = DateTime.UtcNow;

		await dbContext.SaveChangesAsync(ct);

		// Return result with data needed for SignalR notification
		return Result<AnswerQuestionResultDto>.Success(new AnswerQuestionResultDto
		{
			QuestionId = question.Id,
			PetAdId = question.PetAdId,
			QuestionerId = question.UserId,
			Answer = question.Answer,
			AnsweredAt = question.AnsweredAt.Value
		});
	}
}
