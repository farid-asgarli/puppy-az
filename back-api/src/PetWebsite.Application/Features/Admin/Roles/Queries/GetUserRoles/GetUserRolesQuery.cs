using MediatR;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Admin.Roles.Queries.GetUserRoles;

/// <summary>
/// Query to get all roles for a specific user.
/// </summary>
public record GetUserRolesQuery(Guid UserId) : IRequest<Result<List<string>>>;
