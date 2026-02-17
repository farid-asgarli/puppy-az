using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Constants;

namespace PetWebsite.Application.Features.PetAds.Commands.UpdateAnswer;

public class UpdateAnswerCommandHandler(
	IApplicationDbContext dbContext,
	ICurrentUserService currentUserService,
	IStringLocalizer localizer)
	: BaseHandler(localizer),
		ICommandHandler<UpdateAnswerCommand, Result>
{
	public async Task<Result> Handle(UpdateAnswerCommand request, CancellationToken ct)
	{
		var userId = currentUserService.UserId;
		if (userId == null)
			return Result.Failure(L(LocalizationKeys.Error.Unauthorized), 401);

		// Find the question with its pet ad
		var question = await dbContext.PetAdQuestions
			.Include(q => q.PetAd)
			.FirstOrDefaultAsync(q => q.Id == request.QuestionId && !q.IsDeleted, ct);

		if (question == null)
			return Result.Failure(L(LocalizationKeys.PetAd.QuestionNotFound), 404);

		// Check if there's an answer to update
		if (string.IsNullOrEmpty(question.Answer))
			return Result.Failure(L(LocalizationKeys.PetAd.AnswerNotFound), 404);

		// Only ad owner can update the answer
		if (question.PetAd?.UserId != userId.Value)
			return Result.Failure(L(LocalizationKeys.Error.Forbidden), 403);

		// Update the answer
		question.Answer = request.Answer.Trim();
		question.AnsweredAt = DateTime.UtcNow;

		await dbContext.SaveChangesAsync(ct);

		return Result.Success();
	}
}
