using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Admin.PetAds.Commands.AssignBreedToAd;

/// <summary>
/// Command to assign a breed to a pet advertisement.
/// Used by admin after creating a breed from a user's suggestion.
/// </summary>
public record AssignBreedToAdCommand(
	int PetAdId,
	int PetBreedId
) : ICommand<Result>;
