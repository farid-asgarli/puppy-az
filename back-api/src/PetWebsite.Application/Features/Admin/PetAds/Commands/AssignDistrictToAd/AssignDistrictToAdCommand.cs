using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Admin.PetAds.Commands.AssignDistrictToAd;

/// <summary>
/// Command to assign a district to a pet advertisement.
/// Used by admin after creating a district from a user's suggestion.
/// </summary>
public record AssignDistrictToAdCommand(
	int PetAdId,
	int DistrictId
) : ICommand<Result>;
