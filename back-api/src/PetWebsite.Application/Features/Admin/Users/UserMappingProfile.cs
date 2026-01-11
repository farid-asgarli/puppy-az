using AutoMapper;
using PetWebsite.Application.Features.Admin.Users.Commands.CreateUser;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Application.Features.Admin.Users;

/// <summary>
/// AutoMapper profile for User entity mappings.
/// </summary>
public class UserMappingProfile : Profile
{
	public UserMappingProfile()
	{
		// AdminUser -> UserDto
		CreateMap<AdminUser, UserDto>()
			.ForMember(dest => dest.Roles, opt => opt.MapFrom<UserRolesResolver>());
	}
}

/// <summary>
/// Custom value resolver for user roles that retrieves roles from ResolutionContext.
/// </summary>
public class UserRolesResolver : IValueResolver<AdminUser, UserDto, List<string>>
{
	public List<string> Resolve(AdminUser source, UserDto destination, List<string> destMember, ResolutionContext context)
	{
		// Try to get roles from context items
		if (context.Items.TryGetValue("Roles", out var rolesObj) && rolesObj is List<string> roles)
		{
			return roles;
		}

		return [];
	}
}
