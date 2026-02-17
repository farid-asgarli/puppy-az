using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Application.Features.PetAds;

namespace PetWebsite.Application.Features.Admin.PetAds.Queries.GetPetAdById;

/// <summary>
/// Query to get a pet advertisement by ID for admin panel (no status restrictions).
/// </summary>
public record AdminGetPetAdByIdQuery(int Id) : IQuery<Result<MyPetAdListItemDto>>;
