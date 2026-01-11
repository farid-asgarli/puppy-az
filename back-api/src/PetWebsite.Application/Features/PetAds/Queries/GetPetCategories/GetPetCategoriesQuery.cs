using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.PetAds.Queries.GetPetCategories;

public record GetPetCategoriesQuery : IQuery<Result<List<PetCategoryDto>>>;
