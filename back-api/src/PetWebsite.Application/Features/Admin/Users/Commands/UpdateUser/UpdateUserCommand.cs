using MediatR;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Admin.Users.Commands.UpdateUser;

/// <summary>
/// Command to update an admin user.
/// </summary>
public record UpdateUserCommand(Guid UserId, string FirstName, string LastName, bool IsActive) : IRequest<Result>;
