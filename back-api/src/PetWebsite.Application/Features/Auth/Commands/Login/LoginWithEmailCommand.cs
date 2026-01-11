using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Auth.Commands.Login;

/// <summary>
/// Command to login with email and password.
/// </summary>
public record LoginWithEmailCommand(string Email, string Password) : ICommand<Result<AuthenticationResponse>>;
