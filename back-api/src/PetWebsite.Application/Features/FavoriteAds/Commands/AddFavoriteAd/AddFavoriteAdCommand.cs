using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.FavoriteAds.Commands.AddFavoriteAd;

public record AddFavoriteAdCommand(List<int> PetAdIds) : ICommand<Result>;
