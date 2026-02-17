using AutoMapper;
using Microsoft.EntityFrameworkCore;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Admin.Districts.Queries;

public record GetDistrictByIdQuery(int Id) : IQuery<Result<DistrictDto>>;

public class GetDistrictByIdQueryHandler(IApplicationDbContext dbContext, IMapper mapper)
	: IQueryHandler<GetDistrictByIdQuery, Result<DistrictDto>>
{
	public async Task<Result<DistrictDto>> Handle(GetDistrictByIdQuery request, CancellationToken ct)
	{
		var district = await dbContext.Districts
			.AsNoTracking()
			.Include(d => d.City)
			.FirstOrDefaultAsync(d => d.Id == request.Id, ct);

		if (district == null)
			return Result<DistrictDto>.NotFound("District not found");

		var dto = mapper.Map<DistrictDto>(district);

		return Result<DistrictDto>.Success(dto);
	}
}
