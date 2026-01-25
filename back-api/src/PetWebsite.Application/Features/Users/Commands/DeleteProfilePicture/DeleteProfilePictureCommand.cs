using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Users.Commands.DeleteProfilePicture;

/// <summary>
/// Command to delete the current user's profile picture.
/// </summary>
public record DeleteProfilePictureCommand : ICommand<Result>;
