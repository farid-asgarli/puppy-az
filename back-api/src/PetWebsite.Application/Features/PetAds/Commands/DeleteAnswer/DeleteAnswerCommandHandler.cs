using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Constants;

namespace PetWebsite.Application.Features.PetAds.Commands.DeleteAnswer;

public class DeleteAnswerCommandHandler(
	IApplicationDbContext dbContext,
	ICurrentUserService currentUserService,
	IStringLocalizer localizer
) : BaseHandler(localizer), ICommandHandler<DeleteAnswerCommand, Result<DeleteAnswerResultDto>>
{
	public async Task<Result<DeleteAnswerResultDto>> Handle(DeleteAnswerCommand request, CancellationToken ct)
	{
		var userId = currentUserService.UserId;
		if (userId == null)
			return Result<DeleteAnswerResultDto>.Failure(L(LocalizationKeys.Error.Unauthorized), 401);

		// Get the question with the pet ad
		var question = await dbContext
			.PetAdQuestions
			.Include(q => q.PetAd)
			.FirstOrDefaultAsync(q => q.Id == request.QuestionId && !q.IsDeleted, ct);

		if (question == null)
			return Result<DeleteAnswerResultDto>.Failure(L(LocalizationKeys.PetAd.QuestionNotFound), 404);

		// Check if there is an answer to delete
		if (question.Answer == null)
			return Result<DeleteAnswerResultDto>.Failure(L(LocalizationKeys.PetAd.AnswerNotFound), 404);

		// Only the ad owner can delete the answer
		if (question.PetAd.UserId != userId)
			return Result<DeleteAnswerResultDto>.Failure(L(LocalizationKeys.PetAd.OnlyAdOwnerCanDeleteAnswer), 403);

		// Clear the answer
		question.Answer = null;
		question.AnsweredAt = null;

		await dbContext.SaveChangesAsync(ct);

		return Result<DeleteAnswerResultDto>.Success(new DeleteAnswerResultDto
		{
			QuestionId = question.Id,
			PetAdId = question.PetAdId
		});
	}
}
