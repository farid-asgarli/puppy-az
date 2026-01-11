using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Auth.Commands.Logout;

public record LogoutCommand : ICommand<Result<bool>>;
