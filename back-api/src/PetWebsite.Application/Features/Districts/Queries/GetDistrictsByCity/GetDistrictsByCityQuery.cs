using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Districts.Queries.GetDistrictsByCity;

/// <summary>
/// Query to get all active districts for a specific city.
/// </summary>
public record GetDistrictsByCityQuery(int CityId) : IQuery<Result<List<DistrictDto>>>;
