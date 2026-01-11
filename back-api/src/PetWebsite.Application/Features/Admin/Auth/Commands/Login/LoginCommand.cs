using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Admin.Auth.Commands.Login;

public record LoginCommand(string Email, string Password)
    : ICommand<Result<AuthenticationResponse>>;
