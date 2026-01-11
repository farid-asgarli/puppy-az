using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Admin.PetAds.Commands.SetPetAdPremium;

/// <summary>
/// Command to set or remove premium status for a pet ad.
/// </summary>
/// <param name="Id">The ID of the pet ad.</param>
/// <param name="IsPremium">Whether the ad should be premium.</param>
/// <param name="DurationInDays">Duration of premium status in days (required when setting to premium).</param>
public record SetPetAdPremiumCommand(int Id, bool IsPremium, int? DurationInDays = null) : ICommand<Result>;
