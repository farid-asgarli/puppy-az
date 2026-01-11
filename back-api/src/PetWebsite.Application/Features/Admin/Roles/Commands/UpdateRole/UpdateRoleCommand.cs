using MediatR;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Admin.Roles.Commands.UpdateRole;

/// <summary>
/// Command to update an existing role.
/// </summary>
public record UpdateRoleCommand(string RoleId, string NewRoleName) : IRequest<Result>;
