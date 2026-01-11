using Common.Repository.Filtering;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Admin.PetBreeds.Queries.ListPetBreeds;

public class ListPetBreedsQuery : QuerySpecification, ICommand<PaginatedResult<PetBreedListItemDto>>;
