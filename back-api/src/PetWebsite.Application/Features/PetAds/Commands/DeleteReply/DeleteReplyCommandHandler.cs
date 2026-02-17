using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Constants;

namespace PetWebsite.Application.Features.PetAds.Commands.DeleteReply;

public class DeleteReplyCommandHandler(
	IApplicationDbContext dbContext,
	ICurrentUserService currentUserService,
	IStringLocalizer localizer
) : BaseHandler(localizer), ICommandHandler<DeleteReplyCommand, Result<DeleteReplyResultDto>>
{
	public async Task<Result<DeleteReplyResultDto>> Handle(DeleteReplyCommand request, CancellationToken ct)
	{
		var userId = currentUserService.UserId;
		if (userId == null)
			return Result<DeleteReplyResultDto>.Failure(L(LocalizationKeys.Error.Unauthorized), 401);

		// Get the reply with the question and pet ad
		var reply = await dbContext
			.PetAdQuestionReplies
			.Include(r => r.Question)
				.ThenInclude(q => q.PetAd)
			.FirstOrDefaultAsync(r => r.Id == request.ReplyId && !r.IsDeleted, ct);

		if (reply == null)
			return Result<DeleteReplyResultDto>.Failure(L(LocalizationKeys.PetAd.ReplyNotFound), 404);

		// Check if the current user is the reply author OR the ad owner
		if (reply.UserId != userId && reply.Question.PetAd.UserId != userId)
			return Result<DeleteReplyResultDto>.Failure(L(LocalizationKeys.PetAd.OnlyReplyAuthorCanDelete), 403);

		// Soft delete the reply
		reply.IsDeleted = true;

		await dbContext.SaveChangesAsync(ct);

		return Result<DeleteReplyResultDto>.Success(new DeleteReplyResultDto
		{
			ReplyId = reply.Id,
			QuestionId = reply.QuestionId,
			PetAdId = reply.Question.PetAdId
		});
	}
}
