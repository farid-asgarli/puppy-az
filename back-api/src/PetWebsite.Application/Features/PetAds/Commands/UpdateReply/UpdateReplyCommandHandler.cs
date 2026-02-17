using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Constants;

namespace PetWebsite.Application.Features.PetAds.Commands.UpdateReply;

public class UpdateReplyCommandHandler(
	IApplicationDbContext dbContext,
	ICurrentUserService currentUserService,
	IStringLocalizer localizer)
	: BaseHandler(localizer),
		ICommandHandler<UpdateReplyCommand, Result>
{
	public async Task<Result> Handle(UpdateReplyCommand request, CancellationToken ct)
	{
		var userId = currentUserService.UserId;
		if (userId == null)
			return Result.Failure(L(LocalizationKeys.Error.Unauthorized), 401);

		// Find the reply
		var reply = await dbContext.PetAdQuestionReplies
			.FirstOrDefaultAsync(r => r.Id == request.ReplyId && !r.IsDeleted, ct);

		if (reply == null)
			return Result.Failure(L(LocalizationKeys.PetAd.ReplyNotFound), 404);

		// Only reply author can update
		if (reply.UserId != userId.Value)
			return Result.Failure(L(LocalizationKeys.Error.Forbidden), 403);

		// Update the reply
		reply.Text = request.Text.Trim();
		reply.UpdatedAt = DateTime.UtcNow;

		await dbContext.SaveChangesAsync(ct);

		return Result.Success();
	}
}
