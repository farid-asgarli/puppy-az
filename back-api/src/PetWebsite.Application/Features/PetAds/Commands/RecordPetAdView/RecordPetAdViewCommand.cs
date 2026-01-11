using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.PetAds.Commands.RecordPetAdView;

/// <summary>
/// Command to record that a user has viewed a pet advertisement.
/// </summary>
public record RecordPetAdViewCommand(int PetAdId) : ICommand<Result>;
