using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Constants;

namespace PetWebsite.Application.Features.PetAds.Commands.UpdateQuestion;

public class UpdateQuestionCommandHandler(
	IApplicationDbContext dbContext,
	ICurrentUserService currentUserService,
	IStringLocalizer localizer)
	: BaseHandler(localizer),
		ICommandHandler<UpdateQuestionCommand, Result>
{
	public async Task<Result> Handle(UpdateQuestionCommand request, CancellationToken ct)
	{
		var userId = currentUserService.UserId;
		if (userId == null)
			return Result.Failure(L(LocalizationKeys.Error.Unauthorized), 401);

		// Find the question
		var question = await dbContext.PetAdQuestions
			.FirstOrDefaultAsync(q => q.Id == request.QuestionId && !q.IsDeleted, ct);

		if (question == null)
			return Result.Failure(L(LocalizationKeys.PetAd.QuestionNotFound), 404);

		// Only question author can update
		if (question.UserId != userId.Value)
			return Result.Failure(L(LocalizationKeys.Error.Forbidden), 403);

		// Update the question
		question.Question = request.Question.Trim();
		question.UpdatedAt = DateTime.UtcNow;

		await dbContext.SaveChangesAsync(ct);

		return Result.Success();
	}
}
