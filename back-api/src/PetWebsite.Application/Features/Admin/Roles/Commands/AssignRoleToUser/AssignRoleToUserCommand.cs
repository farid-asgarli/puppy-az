using MediatR;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Admin.Roles.Commands.AssignRoleToUser;

/// <summary>
/// Command to assign a role to a user.
/// </summary>
public record AssignRoleToUserCommand(Guid UserId, string RoleName) : IRequest<Result>;
