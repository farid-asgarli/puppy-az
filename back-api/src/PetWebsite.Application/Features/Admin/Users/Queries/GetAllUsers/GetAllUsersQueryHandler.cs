using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PetWebsite.Application.Common.Models;
using PetWebsite.Application.Features.Admin.Users.Commands.CreateUser;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Application.Features.Admin.Users.Queries.GetAllUsers;

/// <summary>
/// Handler for getting all admin users.
/// </summary>
public class GetAllUsersQueryHandler(UserManager<AdminUser> userManager, IMapper mapper)
	: IRequestHandler<GetAllUsersQuery, Result<List<UserDto>>>
{
	private readonly UserManager<AdminUser> _userManager = userManager;
	private readonly IMapper _mapper = mapper;

	public async Task<Result<List<UserDto>>> Handle(GetAllUsersQuery request, CancellationToken cancellationToken)
	{
		var users = await _userManager.Users.ToListAsync(cancellationToken);

		var userDtos = new List<UserDto>();

		foreach (var user in users)
		{
			var roles = await _userManager.GetRolesAsync(user);
			// Map user to UserDto using AutoMapper
			var userDto = _mapper.Map<UserDto>(user, opts => opts.Items["Roles"] = roles.ToList());
			userDtos.Add(userDto);
		}

		return Result<List<UserDto>>.Success(userDtos);
	}
}
