using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Constants;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Application.Features.PetAds.Commands.ReplyToQuestion;

public class ReplyToQuestionCommandHandler(
	IApplicationDbContext dbContext,
	ICurrentUserService currentUserService,
	IStringLocalizer localizer
) : BaseHandler(localizer), ICommandHandler<ReplyToQuestionCommand, Result>
{
	public async Task<Result> Handle(ReplyToQuestionCommand request, CancellationToken ct)
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

		// Check if the user is the ad owner
		var isOwner = question.PetAd.UserId == userId;

		// Create the reply
		var reply = new PetAdQuestionReply
		{
			QuestionId = request.QuestionId,
			UserId = userId.Value,
			Text = request.Text.Trim(),
			IsOwnerReply = isOwner,
			IsDeleted = false
		};

		dbContext.PetAdQuestionReplies.Add(reply);
		await dbContext.SaveChangesAsync(ct);

		return Result.Success();
	}
}
