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
) : BaseHandler(localizer), ICommandHandler<ReplyToQuestionCommand, Result<ReplyToQuestionResultDto>>
{
	public async Task<Result<ReplyToQuestionResultDto>> Handle(ReplyToQuestionCommand request, CancellationToken ct)
	{
		var userId = currentUserService.UserId;
		if (userId == null)
			return Result<ReplyToQuestionResultDto>.Failure(L(LocalizationKeys.Error.Unauthorized), 401);

		// Get the question with the pet ad
		var question = await dbContext
			.PetAdQuestions
			.Include(q => q.PetAd)
			.IgnoreQueryFilters()
			.FirstOrDefaultAsync(q => q.Id == request.QuestionId && !q.IsDeleted, ct);

		if (question == null)
			return Result<ReplyToQuestionResultDto>.Failure(L(LocalizationKeys.PetAd.QuestionNotFound), 404);

		// Check if the pet ad exists and is not deleted
		if (question.PetAd == null || question.PetAd.IsDeleted)
			return Result<ReplyToQuestionResultDto>.Failure(L(LocalizationKeys.PetAd.QuestionNotFound), 404);

		// Anyone can reply - no permission restrictions
		var isOwner = question.PetAd.UserId == userId;

		// Get the current user's name
		var currentUser = await dbContext.RegularUsers.FindAsync([userId.Value], ct);
		var userName = currentUser?.FullName ?? "İstifadəçi";

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

		return Result<ReplyToQuestionResultDto>.Success(new ReplyToQuestionResultDto
		{
			ReplyId = reply.Id,
			QuestionId = question.Id,
			PetAdId = question.PetAdId,
			QuestionerId = question.UserId.ToString(),
			UserName = userName,
			Text = reply.Text,
			IsOwnerReply = isOwner,
			CreatedAt = reply.CreatedAt
		});
	}
}
