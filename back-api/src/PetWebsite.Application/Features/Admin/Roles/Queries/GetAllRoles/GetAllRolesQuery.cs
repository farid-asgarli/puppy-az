using MediatR;
using PetWebsite.Application.Common.Models;
using PetWebsite.Application.Features.Admin.Roles.Commands.CreateRole;

namespace PetWebsite.Application.Features.Admin.Roles.Queries.GetAllRoles;

/// <summary>
/// Query to get all roles.
/// </summary>
public record GetAllRolesQuery : IRequest<Result<List<RoleDto>>>;
