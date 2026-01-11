using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.PetAds.Queries.GetMyPetAdById;

/// <summary>
/// Query to get details of a pet ad owned by the current user.
/// </summary>
public record GetMyPetAdByIdQuery(int Id) : IQuery<Result<MyPetAdDetailsDto>>;
