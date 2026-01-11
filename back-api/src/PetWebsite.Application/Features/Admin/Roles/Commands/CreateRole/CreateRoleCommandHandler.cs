using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Constants;

namespace PetWebsite.Application.Features.Admin.Roles.Commands.CreateRole;

/// <summary>
/// Handler for creating a new role.
/// </summary>
public class CreateRoleCommandHandler(RoleManager<IdentityRole<Guid>> roleManager, IMapper mapper, IStringLocalizer localizer)
	: BaseHandler(localizer),
		IRequestHandler<CreateRoleCommand, Result<RoleDto>>
{
	private readonly RoleManager<IdentityRole<Guid>> _roleManager = roleManager;
	private readonly IMapper _mapper = mapper;

	public async Task<Result<RoleDto>> Handle(CreateRoleCommand request, CancellationToken cancellationToken)
	{
		// Check if role already exists
		if (await _roleManager.RoleExistsAsync(request.RoleName))
		{
			return Result<RoleDto>.Failure(L(LocalizationKeys.Role.AlreadyExists), 400);
		}

		var role = new IdentityRole<Guid>(request.RoleName);
		var result = await _roleManager.CreateAsync(role);

		if (!result.Succeeded)
		{
			var errors = string.Join(", ", result.Errors.Select(e => e.Description));
			return Result<RoleDto>.Failure(L(LocalizationKeys.Role.CreateFailed) + ": " + errors, 400);
		}

		// Map role to RoleDto using AutoMapper
		var roleDto = _mapper.Map<RoleDto>(role);
		return Result<RoleDto>.Success(roleDto);
	}
}
