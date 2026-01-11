using MediatR;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Admin.Roles.Commands.RemoveRoleFromUser;

/// <summary>
/// Command to remove a role from a user.
/// </summary>
public record RemoveRoleFromUserCommand(Guid UserId, string RoleName) : IRequest<Result>;
