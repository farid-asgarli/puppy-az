using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.PetAds.Commands.IncrementViewCount;

/// <summary>
/// Command to increment view count for a pet ad (anonymous access allowed)
/// </summary>
public record IncrementViewCountCommand(int PetAdId) : ICommand<Result>;
