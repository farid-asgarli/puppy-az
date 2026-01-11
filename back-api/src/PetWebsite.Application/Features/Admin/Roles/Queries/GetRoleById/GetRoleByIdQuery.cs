using MediatR;
using PetWebsite.Application.Common.Models;
using PetWebsite.Application.Features.Admin.Roles.Commands.CreateRole;

namespace PetWebsite.Application.Features.Admin.Roles.Queries.GetRoleById;

/// <summary>
/// Query to get a role by ID.
/// </summary>
public record GetRoleByIdQuery(string RoleId) : IRequest<Result<RoleDto>>;
