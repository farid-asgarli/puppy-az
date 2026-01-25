using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Application.Extensions;
using PetWebsite.Domain.Constants;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Application.Features.PetAds.Commands.IncrementViewCount;

public class IncrementViewCountCommandHandler(
	IApplicationDbContext dbContext,
	IStringLocalizer localizer
) : BaseHandler(localizer), ICommandHandler<IncrementViewCountCommand, Result>
{
	public async Task<Result> Handle(IncrementViewCountCommand request, CancellationToken ct)
	{
		// Verify the pet ad exists and is not deleted
		var petAdExists = await dbContext.PetAds.WhereNotDeleted<PetAd, int>().AnyAsync(p => p.Id == request.PetAdId, ct);

		if (!petAdExists)
			return Result.Failure(L(LocalizationKeys.PetAd.NotFound), 404);

		// Increment view count without triggering UpdatedAt via interceptor
		await dbContext
			.PetAds.Where(p => p.Id == request.PetAdId)
			.ExecuteUpdateAsync(setters => setters.SetProperty(p => p.ViewCount, p => p.ViewCount + 1), ct);

		return Result.Success();
	}
}
