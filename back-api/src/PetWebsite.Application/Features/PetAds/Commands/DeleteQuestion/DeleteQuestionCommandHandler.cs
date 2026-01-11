using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Constants;

namespace PetWebsite.Application.Features.PetAds.Commands.DeleteQuestion;

public class DeleteQuestionCommandHandler(
	IApplicationDbContext dbContext,
	ICurrentUserService currentUserService,
	IStringLocalizer localizer
) : BaseHandler(localizer), ICommandHandler<DeleteQuestionCommand, Result>
{
	public async Task<Result> Handle(DeleteQuestionCommand request, CancellationToken ct)
	{
		var userId = currentUserService.UserId;
		if (userId == null)
			return Result.Failure(L(LocalizationKeys.Error.Unauthorized), 401);

		// Get the question with the pet ad
		var question = await dbContext
			.PetAdQuestions.Include(q => q.PetAd)
			.FirstOrDefaultAsync(q => q.Id == request.QuestionId && !q.IsDeleted, ct);

		if (question == null)
			return Result.Failure(L(LocalizationKeys.PetAd.QuestionNotFound), 404);

		// Check if the current user is the ad owner
		if (question.PetAd.UserId != userId)
			return Result.Failure(L(LocalizationKeys.PetAd.OnlyAdOwnerCanDeleteQuestion), 403);

		// Soft delete the question
		question.IsDeleted = true;

		await dbContext.SaveChangesAsync(ct);

		return Result.Success();
	}
}
