using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Models;
using PetWebsite.Application.Features.Admin.Roles.Commands.CreateRole;
using PetWebsite.Domain.Constants;

namespace PetWebsite.Application.Features.Admin.Roles.Queries.GetRoleById;

/// <summary>
/// Handler for getting a role by ID.
/// </summary>
public class GetRoleByIdQueryHandler(RoleManager<IdentityRole<Guid>> roleManager, IMapper mapper, IStringLocalizer localizer)
	: BaseHandler(localizer),
		IRequestHandler<GetRoleByIdQuery, Result<RoleDto>>
{
	private readonly RoleManager<IdentityRole<Guid>> _roleManager = roleManager;
	private readonly IMapper _mapper = mapper;

	public async Task<Result<RoleDto>> Handle(GetRoleByIdQuery request, CancellationToken cancellationToken)
	{
		var role = await _roleManager.FindByIdAsync(request.RoleId);
		if (role == null)
		{
			return Result<RoleDto>.NotFound(L(LocalizationKeys.Role.NotFound));
		}

		// Map role to RoleDto using AutoMapper
		var roleDto = _mapper.Map<RoleDto>(role);
		return Result<RoleDto>.Success(roleDto);
	}
}
