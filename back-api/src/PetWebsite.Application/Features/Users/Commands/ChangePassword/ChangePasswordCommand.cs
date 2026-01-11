using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Users.Commands.ChangePassword;

/// <summary>
/// Command to allow a user to change their password.
/// </summary>
public record ChangePasswordCommand(string CurrentPassword, string NewPassword) : ICommand<Result>;
