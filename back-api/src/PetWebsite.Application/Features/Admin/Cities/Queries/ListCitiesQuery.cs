using Common.Repository.Filtering;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Admin.Cities.Queries;

public class ListCitiesQuery : QuerySpecification, ICommand<PaginatedResult<CityListItemDto>>;
