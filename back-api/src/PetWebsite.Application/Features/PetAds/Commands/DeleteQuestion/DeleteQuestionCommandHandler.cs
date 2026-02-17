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
) : BaseHandler(localizer), ICommandHandler<DeleteQuestionCommand, Result<DeleteQuestionResultDto>>
{
	public async Task<Result<DeleteQuestionResultDto>> Handle(DeleteQuestionCommand request, CancellationToken ct)
	{
		var userId = currentUserService.UserId;
		if (userId == null)
			return Result<DeleteQuestionResultDto>.Failure(L(LocalizationKeys.Error.Unauthorized), 401);

		// Get the question with the pet ad and replies
		var question = await dbContext
			.PetAdQuestions
			.Include(q => q.PetAd)
			.Include(q => q.Replies)
			.FirstOrDefaultAsync(q => q.Id == request.QuestionId && !q.IsDeleted, ct);

		if (question == null)
			return Result<DeleteQuestionResultDto>.Failure(L(LocalizationKeys.PetAd.QuestionNotFound), 404);

		// Check if the current user is the ad owner OR the question author
		if (question.PetAd.UserId != userId && question.UserId != userId)
			return Result<DeleteQuestionResultDto>.Failure(L(LocalizationKeys.PetAd.OnlyAdOwnerCanDeleteQuestion), 403);

		// Soft delete all replies first
		foreach (var reply in question.Replies.Where(r => !r.IsDeleted))
		{
			reply.IsDeleted = true;
		}

		// Soft delete the question
		question.IsDeleted = true;

		await dbContext.SaveChangesAsync(ct);

		return Result<DeleteQuestionResultDto>.Success(new DeleteQuestionResultDto
		{
			QuestionId = question.Id,
			PetAdId = question.PetAdId
		});
	}
}
