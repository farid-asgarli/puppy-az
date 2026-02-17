using Common.Repository.Filtering;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Admin.PetAdTypes.Queries.ListPetAdTypes;

public class ListPetAdTypesQuery : QuerySpecification, ICommand<PaginatedResult<PetAdTypeListItemDto>>;
