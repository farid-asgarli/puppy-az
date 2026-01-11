using MediatR;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Admin.Roles.Commands.DeleteRole;

/// <summary>
/// Command to delete a role.
/// </summary>
public record DeleteRoleCommand(string RoleId) : IRequest<Result>;
