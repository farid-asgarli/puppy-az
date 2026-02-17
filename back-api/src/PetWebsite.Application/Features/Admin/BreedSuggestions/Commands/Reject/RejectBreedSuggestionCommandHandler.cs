using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Constants;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Application.Features.Admin.BreedSuggestions.Commands.Reject;

public class RejectBreedSuggestionCommandHandler(IApplicationDbContext dbContext, IStringLocalizer localizer)
	: BaseHandler(localizer),
		ICommandHandler<RejectBreedSuggestionCommand, Result>
{
	public async Task<Result> Handle(RejectBreedSuggestionCommand request, CancellationToken ct)
	{
		var suggestion = await dbContext.BreedSuggestions
			.FirstOrDefaultAsync(s => s.Id == request.SuggestionId, ct);

		if (suggestion == null)
			return Result.Failure(L(LocalizationKeys.BreedSuggestion.NotFound), 404);

		if (suggestion.Status != BreedSuggestionStatus.Pending)
			return Result.Failure(L(LocalizationKeys.BreedSuggestion.AlreadyProcessed));

		suggestion.Status = BreedSuggestionStatus.Rejected;
		suggestion.AdminNote = request.AdminNote;

		await dbContext.SaveChangesAsync(ct);

		return Result.Success();
	}
}
