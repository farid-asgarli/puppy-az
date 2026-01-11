using MediatR;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Admin.Users.Commands.DeleteUser;

/// <summary>
/// Command to delete a user.
/// </summary>
public record DeleteUserCommand(Guid UserId) : IRequest<Result>;
