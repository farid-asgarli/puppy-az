using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Cities.Queries.GetCities;

/// <summary>
/// Query to get all active cities.
/// </summary>
public record GetCitiesQuery : IQuery<Result<List<CityDto>>>;
