using MediatR;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Admin.RegularUsers.Commands.CreateRegularUser;

/// <summary>
/// Command to create a new regular user (consumer) by admin.
/// </summary>
/// <param name="PhoneNumber">User's phone number (required)</param>
/// <param name="FirstName">User's first name (optional)</param>
/// <param name="LastName">User's last name (optional)</param>
public record CreateRegularUserCommand(
	string PhoneNumber,
	string? FirstName = null,
	string? LastName = null
) : IRequest<Result<Guid>>;
