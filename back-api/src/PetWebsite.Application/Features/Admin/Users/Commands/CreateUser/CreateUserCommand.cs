using MediatR;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Admin.Users.Commands.CreateUser;

/// <summary>
/// Command to create a new admin user.
/// </summary>
public record CreateUserCommand(
    string Email,
    string Password,
    string FirstName,
    string LastName,
    List<string> Roles
) : IRequest<Result<UserDto>>;

public record UserDto(
    int Id,
    string Email,
    string FirstName,
    string LastName,
    bool IsActive,
    List<string> Roles
);
