namespace PetWebsite.Application.Features.Admin.RegularUsers.Commands.CreateRegularUser;

/// <summary>
/// Result of <see cref="CreateRegularUserCommand"/>.
/// </summary>
/// <param name="UserId">Id of the created or already-existing user.</param>
/// <param name="AlreadyExisted">
/// True when a user with the given phone number already existed (e.g. the
/// person registered themselves) and was returned instead of creating a new one.
/// </param>
public record CreateRegularUserResult(Guid UserId, bool AlreadyExisted);
