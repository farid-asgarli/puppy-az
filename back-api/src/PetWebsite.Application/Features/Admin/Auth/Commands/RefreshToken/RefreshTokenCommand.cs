using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Admin.Auth.Commands.RefreshToken;

public record RefreshTokenCommand(string RefreshToken) : ICommand<Result<AuthenticationResponse>>;
