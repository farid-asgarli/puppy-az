using MediatR;
using PetWebsite.Application.Common.Models;
using PetWebsite.Application.Features.Admin.Users.Commands.CreateUser;

namespace PetWebsite.Application.Features.Admin.Users.Queries.GetUserById;

/// <summary>
/// Query to get an admin user by ID.
/// </summary>
public record GetUserByIdQuery(Guid UserId) : IRequest<Result<UserDto>>;
