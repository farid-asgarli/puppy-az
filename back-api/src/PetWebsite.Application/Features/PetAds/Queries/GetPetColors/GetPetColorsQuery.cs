using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.PetAds.Queries.GetPetColors;

public record GetPetColorsQuery : IQuery<Result<List<PetColorDto>>>;
