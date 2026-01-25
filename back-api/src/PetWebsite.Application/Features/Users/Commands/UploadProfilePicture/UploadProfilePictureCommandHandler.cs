using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Constants;

namespace PetWebsite.Application.Features.Users.Commands.UploadProfilePicture;

public class UploadProfilePictureCommandHandler(
	IApplicationDbContext dbContext,
	IFileService fileService,
	IImageProcessingService imageProcessingService,
	ICurrentUserService currentUserService,
	IStringLocalizer localizer,
	IUrlService urlService,
	ILogger<UploadProfilePictureCommandHandler> logger
) : BaseHandler(localizer), ICommandHandler<UploadProfilePictureCommand, Result<ProfilePictureDto>>
{
	private static readonly string[] AllowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];

	public async Task<Result<ProfilePictureDto>> Handle(UploadProfilePictureCommand request, CancellationToken ct)
	{
		// Get current user ID
		var userId = currentUserService.UserId;
		if (userId is null)
			return Result<ProfilePictureDto>.Failure(L(LocalizationKeys.Error.Unauthorized), 401);

		// Validate file
		if (request.File == null || request.File.Length == 0)
			return Result<ProfilePictureDto>.Failure(L(LocalizationKeys.File.FileNameCannotBeEmpty), 400);

		var extension = Path.GetExtension(request.File.FileName).ToLowerInvariant();
		if (!AllowedExtensions.Contains(extension))
			return Result<ProfilePictureDto>.Failure(L(LocalizationKeys.File.InvalidExtension), 400);

		// Get user
		var user = await dbContext.RegularUsers.FindAsync([userId.Value], ct);
		if (user == null)
			return Result<ProfilePictureDto>.Failure(L(LocalizationKeys.User.NotFound), 404);

		// Open the file stream
		await using var originalStream = request.File.OpenReadStream();
		var originalFileName = request.File.FileName;

		// Process/compress the image
		Stream streamToSave;
		string fileNameToSave;

		if (imageProcessingService.IsSupportedImageFormat(originalFileName))
		{
			var processingResult = await imageProcessingService.ProcessImageAsync(originalStream, originalFileName, ct);

			if (processingResult.WasProcessed)
			{
				logger.LogInformation(
					"Profile picture {OriginalFileName} compressed: {OriginalSize} -> {ProcessedSize} bytes",
					originalFileName,
					processingResult.OriginalSize,
					processingResult.ProcessedSize
				);

				streamToSave = processingResult.ProcessedStream;
				fileNameToSave = processingResult.ProcessedFileName;
			}
			else
			{
				streamToSave = processingResult.ProcessedStream;
				fileNameToSave = originalFileName;
			}
		}
		else
		{
			streamToSave = originalStream;
			fileNameToSave = originalFileName;
		}

		// Delete old profile picture if exists
		if (!string.IsNullOrEmpty(user.ProfilePictureUrl))
		{
			try
			{
				// Extract relative path from URL (remove /uploads/ prefix)
				var oldPath = user.ProfilePictureUrl.Replace("/uploads/", "");
				fileService.DeleteFileAsync(oldPath, ct);
			}
			catch (Exception ex)
			{
				logger.LogWarning(ex, "Failed to delete old profile picture: {OldUrl}", user.ProfilePictureUrl);
			}
		}

		// Save new profile picture (in profile-pictures subfolder)
		var fileMetadata = await fileService.SaveFileAsync(streamToSave, fileNameToSave, "profile-pictures", ct);

		// Dispose the processed stream if it was created
		if (streamToSave != originalStream)
		{
			await streamToSave.DisposeAsync();
		}

		// Update user's profile picture URL
		var relativePath = $"/uploads/{fileMetadata.RelativePath}";
		user.ProfilePictureUrl = relativePath;

		await dbContext.SaveChangesAsync(ct);

		// Return absolute URL
		var absoluteUrl = urlService.ToAbsoluteUrl(relativePath);

		return Result<ProfilePictureDto>.Success(new ProfilePictureDto { Url = absoluteUrl });
	}
}
