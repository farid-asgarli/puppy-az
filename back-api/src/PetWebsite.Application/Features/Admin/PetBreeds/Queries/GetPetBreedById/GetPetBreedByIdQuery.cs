using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Admin.PetBreeds.Queries.GetPetBreedById;

public record GetPetBreedByIdQuery(int Id) : IQuery<Result<PetBreedDto>>;
