using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.PetAds.Queries.GetPetBreeds;

/// <summary>
/// Query to get a list of pet breeds, optionally filtered by category.
/// </summary>
public record GetPetBreedsQuery(int? PetCategoryId = null) : IQuery<Result<List<PetBreedDto>>>;
