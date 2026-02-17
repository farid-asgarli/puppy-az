using Common.Repository.Filtering;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Admin.Districts.Queries;

public class ListDistrictsQuery : QuerySpecification, ICommand<PaginatedResult<DistrictListItemDto>>
{
	public int? CityId { get; set; }
}
