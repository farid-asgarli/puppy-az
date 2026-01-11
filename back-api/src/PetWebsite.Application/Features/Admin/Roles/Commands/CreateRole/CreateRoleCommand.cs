using MediatR;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Admin.Roles.Commands.CreateRole;

/// <summary>
/// Command to create a new role.
/// </summary>
public record CreateRoleCommand(string RoleName) : IRequest<Result<RoleDto>>;

public record RoleDto(string Id, string Name);
