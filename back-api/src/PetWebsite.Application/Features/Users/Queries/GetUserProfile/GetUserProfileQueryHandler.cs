using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Constants;

namespace PetWebsite.Application.Features.Users.Queries.GetUserProfile;

public class GetUserProfileQueryHandler(
	IApplicationDbContext dbContext,
	ICurrentUserService currentUserService,
	IUrlService urlService,
	IStringLocalizer localizer
)
	: BaseHandler(localizer),
		IQueryHandler<GetUserProfileQuery, Result<UserProfileDto>>
{
	public async Task<Result<UserProfileDto>> Handle(GetUserProfileQuery request, CancellationToken ct)
	{
		var userId = currentUserService.UserId;
		if (userId == null)
			return Result<UserProfileDto>.Failure(L(LocalizationKeys.Error.Unauthorized), 401);

		var user = await dbContext
			.RegularUsers.AsNoTracking()
			.Where(u => u.Id == userId.Value && u.IsActive)
			.Select(u => new UserProfileDto
			{
				Id = u.Id,
				Email = u.Email ?? string.Empty,
				FirstName = u.FirstName,
				LastName = u.LastName,
				PhoneNumber = u.PhoneNumber,
				ProfilePictureUrl = string.IsNullOrEmpty(u.ProfilePictureUrl)
					? null
					: urlService.ToAbsoluteUrl(u.ProfilePictureUrl),
				CreatedAt = u.CreatedAt,
				LastLoginAt = u.LastLoginAt,
			})
			.FirstOrDefaultAsync(ct);

		if (user == null)
			return Result<UserProfileDto>.Failure(L(LocalizationKeys.User.NotFound), 404);

		return Result<UserProfileDto>.Success(user);
	}
}
