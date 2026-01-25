using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Constants;

namespace PetWebsite.Application.Features.Users.Commands.DeleteProfilePicture;

public class DeleteProfilePictureCommandHandler(
	IApplicationDbContext dbContext,
	IFileService fileService,
	ICurrentUserService currentUserService,
	IStringLocalizer localizer,
	ILogger<DeleteProfilePictureCommandHandler> logger
) : BaseHandler(localizer), ICommandHandler<DeleteProfilePictureCommand, Result>
{
	public async Task<Result> Handle(DeleteProfilePictureCommand request, CancellationToken ct)
	{
		// Get current user ID
		var userId = currentUserService.UserId;
		if (userId is null)
			return Result.Failure(L(LocalizationKeys.Error.Unauthorized), 401);

		// Get user
		var user = await dbContext.RegularUsers.FindAsync([userId.Value], ct);
		if (user == null)
			return Result.Failure(L(LocalizationKeys.User.NotFound), 404);

		// Check if user has a profile picture
		if (string.IsNullOrEmpty(user.ProfilePictureUrl))
			return Result.Success(); // Already no picture, return success

		// Delete the file
		try
		{
			var oldPath = user.ProfilePictureUrl.Replace("/uploads/", "");
			await fileService.DeleteFileAsync(oldPath, ct);
			logger.LogInformation("Deleted profile picture: {Path}", oldPath);
		}
		catch (Exception ex)
		{
			logger.LogWarning(ex, "Failed to delete profile picture file: {Url}", user.ProfilePictureUrl);
			// Continue even if file deletion fails
		}

		// Clear the profile picture URL
		user.ProfilePictureUrl = null;
		await dbContext.SaveChangesAsync(ct);

		return Result.Success();
	}
}
