using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Users.Queries.GetUserProfile;

/// <summary>
/// Query to get the current user's profile information.
/// </summary>
public record GetUserProfileQuery : IQuery<Result<UserProfileDto>>;
