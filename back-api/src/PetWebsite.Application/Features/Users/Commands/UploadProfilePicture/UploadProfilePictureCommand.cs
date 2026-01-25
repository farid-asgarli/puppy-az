using Microsoft.AspNetCore.Http;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Users.Commands.UploadProfilePicture;

/// <summary>
/// Command to upload a profile picture for the current user.
/// </summary>
public record UploadProfilePictureCommand(IFormFile File) : ICommand<Result<ProfilePictureDto>>;

/// <summary>
/// DTO for uploaded profile picture response.
/// </summary>
public record ProfilePictureDto
{
	public string Url { get; init; } = string.Empty;
}
