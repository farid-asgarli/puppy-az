using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Admin.Auth.Commands.Logout;

public record AdminLogoutCommand : ICommand<Result<bool>>;
