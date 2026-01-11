using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.PetAds.Commands.ClosePetAd;

public record ClosePetAdCommand(int Id) : ICommand<Result>;
