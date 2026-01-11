using AutoMapper;
using Microsoft.AspNetCore.Identity;
using PetWebsite.Application.Features.Admin.Roles.Commands.CreateRole;

namespace PetWebsite.Application.Features.Admin.Roles;

/// <summary>
/// AutoMapper profile for Role entity mappings.
/// </summary>
public class RoleMappingProfile : Profile
{
	public RoleMappingProfile()
	{
		// IdentityRole<int> -> RoleDto
		CreateMap<IdentityRole<int>, RoleDto>()
			.ConstructUsing(src => new RoleDto(src.Id.ToString(), src.Name!));
	}
}
