using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Constants;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Application.Features.Admin.Users.Commands.CreateUser;

/// <summary>
/// Handler for creating a new admin user.
/// </summary>
public class CreateUserCommandHandler(UserManager<AdminUser> userManager, IMapper mapper, IStringLocalizer localizer)
	: BaseHandler(localizer),
		IRequestHandler<CreateUserCommand, Result<UserDto>>
{
	private readonly UserManager<AdminUser> _userManager = userManager;
	private readonly IMapper _mapper = mapper;

	public async Task<Result<UserDto>> Handle(CreateUserCommand request, CancellationToken cancellationToken)
	{
		// Check if user already exists
		var existingUser = await _userManager.FindByEmailAsync(request.Email);
		if (existingUser != null)
		{
			return Result<UserDto>.Failure(L(LocalizationKeys.Auth.UserAlreadyExists), 400);
		}

		// Create user
		var user = new AdminUser
		{
			UserName = request.Email,
			Email = request.Email,
			FirstName = request.FirstName,
			LastName = request.LastName,
			IsActive = true,
		};

		var result = await _userManager.CreateAsync(user, request.Password);

		if (!result.Succeeded)
		{
			var errors = string.Join(", ", result.Errors.Select(e => e.Description));
			return Result<UserDto>.Failure(L(LocalizationKeys.User.CreateFailed) + ": " + errors, 400);
		}

		// Assign roles
		if (request.Roles != null && request.Roles.Count != 0)
		{
			var roleResult = await _userManager.AddToRolesAsync(user, request.Roles);
			if (!roleResult.Succeeded)
			{
				var errors = string.Join(", ", roleResult.Errors.Select(e => e.Description));
				return Result<UserDto>.Failure(L(LocalizationKeys.User.RoleAssignFailed) + ": " + errors, 400);
			}
		}

		// Map user to UserDto using AutoMapper
		var userDto = _mapper.Map<UserDto>(user, opts => opts.Items["Roles"] = request.Roles ?? []);

		return Result<UserDto>.Success(userDto);
	}
}
