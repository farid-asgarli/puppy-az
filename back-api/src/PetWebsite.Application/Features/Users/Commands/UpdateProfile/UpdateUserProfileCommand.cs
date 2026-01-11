using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Users.Commands.UpdateProfile;

/// <summary>
/// Command to allow a user to update their profile information.
/// </summary>
public record UpdateUserProfileCommand(string FirstName, string LastName, string? PhoneNumber, string? ProfilePictureUrl)
	: ICommand<Result>;
