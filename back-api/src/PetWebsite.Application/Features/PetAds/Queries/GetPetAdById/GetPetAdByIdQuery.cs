using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.PetAds.Queries.GetPetAdById;

public record GetPetAdByIdQuery(int Id) : IQuery<Result<PetAdDetailsDto>>;
