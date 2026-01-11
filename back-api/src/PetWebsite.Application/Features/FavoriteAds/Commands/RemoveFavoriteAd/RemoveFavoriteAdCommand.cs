using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.FavoriteAds.Commands.RemoveFavoriteAd;

public record RemoveFavoriteAdCommand(int PetAdId) : ICommand<Result>;
