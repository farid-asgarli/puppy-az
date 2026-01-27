using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.PetAds.Queries.GetPetCategoriesDetailed;

public record GetPetCategoriesDetailedQuery(string? LocaleCode = null) : IQuery<Result<List<PetCategoryDetailedDto>>>;
