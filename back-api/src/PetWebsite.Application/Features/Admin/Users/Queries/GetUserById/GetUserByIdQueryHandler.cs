using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Models;
using PetWebsite.Application.Features.Admin.Users.Commands.CreateUser;
using PetWebsite.Domain.Constants;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Application.Features.Admin.Users.Queries.GetUserById;

/// <summary>
/// Handler for getting an admin user by ID.
/// </summary>
public class GetUserByIdQueryHandler(UserManager<AdminUser> userManager, IMapper mapper, IStringLocalizer localizer)
	: BaseHandler(localizer),
		IRequestHandler<GetUserByIdQuery, Result<UserDto>>
{
	private readonly UserManager<AdminUser> _userManager = userManager;
	private readonly IMapper _mapper = mapper;

	public async Task<Result<UserDto>> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
	{
		var user = await _userManager.FindByIdAsync(request.UserId.ToString());
		if (user == null)
		{
			return Result<UserDto>.NotFound(L(LocalizationKeys.User.NotFound));
		}

		var roles = await _userManager.GetRolesAsync(user);

		// Map user to UserDto using AutoMapper
		var userDto = _mapper.Map<UserDto>(user, opts => opts.Items["Roles"] = roles.ToList());

		return Result<UserDto>.Success(userDto);
	}
}
