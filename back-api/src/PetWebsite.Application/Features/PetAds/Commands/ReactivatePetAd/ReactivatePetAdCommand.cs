using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.PetAds.Commands.ReactivatePetAd;

/// <summary>
/// Command to reactivate an expired pet advertisement.
/// The ad will be set to Pending status for admin review.
/// </summary>
public record ReactivatePetAdCommand(int Id) : ICommand<Result>;
