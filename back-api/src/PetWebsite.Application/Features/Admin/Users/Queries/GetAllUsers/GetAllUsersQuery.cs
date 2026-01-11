using MediatR;
using PetWebsite.Application.Common.Models;
using PetWebsite.Application.Features.Admin.Users.Commands.CreateUser;

namespace PetWebsite.Application.Features.Admin.Users.Queries.GetAllUsers;

/// <summary>
/// Query to get all admin users.
/// </summary>
public record GetAllUsersQuery : IRequest<Result<List<UserDto>>>;
