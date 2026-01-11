using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PetWebsite.Application.Common.Models;
using PetWebsite.Application.Features.Admin.Roles.Commands.CreateRole;

namespace PetWebsite.Application.Features.Admin.Roles.Queries.GetAllRoles;

/// <summary>
/// Handler for getting all roles.
/// </summary>
public class GetAllRolesQueryHandler(RoleManager<IdentityRole<Guid>> roleManager, IMapper mapper)
	: IRequestHandler<GetAllRolesQuery, Result<List<RoleDto>>>
{
	private readonly RoleManager<IdentityRole<Guid>> _roleManager = roleManager;
	private readonly IMapper _mapper = mapper;

	public async Task<Result<List<RoleDto>>> Handle(GetAllRolesQuery request, CancellationToken cancellationToken)
	{
		var roles = await _roleManager.Roles.ToListAsync(cancellationToken);

		// Map roles to RoleDto using AutoMapper
		var roleDtos = _mapper.Map<List<RoleDto>>(roles);

		return Result<List<RoleDto>>.Success(roleDtos);
	}
}

