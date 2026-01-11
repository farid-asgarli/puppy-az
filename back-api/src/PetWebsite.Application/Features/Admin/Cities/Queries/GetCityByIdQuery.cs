using AutoMapper;
using Microsoft.EntityFrameworkCore;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Admin.Cities.Queries;

public record GetCityByIdQuery(int Id) : IQuery<Result<CityDto>>;

public class GetCityByIdQueryHandler(IApplicationDbContext dbContext, IMapper mapper) : IQueryHandler<GetCityByIdQuery, Result<CityDto>>
{
	public async Task<Result<CityDto>> Handle(GetCityByIdQuery request, CancellationToken ct)
	{
		var city = await dbContext.Cities.AsNoTracking().FirstOrDefaultAsync(c => c.Id == request.Id, ct);

		if (city == null)
			return Result<CityDto>.NotFound("City not found");

		var dto = mapper.Map<CityDto>(city);

		return Result<CityDto>.Success(dto);
	}
}
