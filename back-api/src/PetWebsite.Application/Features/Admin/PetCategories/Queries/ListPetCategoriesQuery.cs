using Common.Repository.Filtering;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Admin.PetCategories.Queries;

public class ListPetCategoriesQuery : QuerySpecification, ICommand<PaginatedResult<PetCategoryListItemDto>>;
