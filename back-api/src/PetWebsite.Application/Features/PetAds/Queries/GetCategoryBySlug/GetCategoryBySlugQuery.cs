using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.PetAds.Queries.GetCategoryBySlug;

public record GetCategoryBySlugQuery(string Slug) : IQuery<Result<PetCategoryDetailedDto>>;
