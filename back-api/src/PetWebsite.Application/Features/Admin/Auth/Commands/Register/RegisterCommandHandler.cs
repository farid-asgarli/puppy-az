using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Options;
using PetWebsite.Application.Common.Configuration;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Constants;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Application.Features.Admin.Auth.Commands.Register;

public class RegisterCommandHandler(
	UserManager<AdminUser> userManager,
	IJwtTokenService jwtTokenService,
	IOptions<JwtSettings> jwtSettings,
	IStringLocalizer localizer
) : BaseHandler(localizer), ICommandHandler<RegisterCommand, Result<AuthenticationResponse>>
{
	private readonly UserManager<AdminUser> _userManager = userManager;
	private readonly IJwtTokenService _jwtTokenService = jwtTokenService;
	private readonly JwtSettings _jwtSettings = jwtSettings.Value;

	public async Task<Result<AuthenticationResponse>> Handle(RegisterCommand request, CancellationToken cancellationToken)
	{
		try
		{
			// Check if user already exists
			var existingUser = await _userManager.FindByEmailAsync(request.Email);
			if (existingUser != null)
			{
				return Result<AuthenticationResponse>.Failure(L(LocalizationKeys.Auth.UserAlreadyExists), 400);
			}

			// Create new admin user
			var user = new AdminUser
			{
				UserName = request.Email,
				Email = request.Email,
				FirstName = request.FirstName,
				LastName = request.LastName,
				CreatedAt = DateTime.UtcNow,
				IsActive = true,
			};

			var result = await _userManager.CreateAsync(user, request.Password);
			if (!result.Succeeded)
			{
				var errors = string.Join(", ", result.Errors.Select(e => e.Description));
				return Result<AuthenticationResponse>.Failure(L(LocalizationKeys.User.CreateFailed, errors), 400);
			}

			// Assign role
			var roleResult = await _userManager.AddToRoleAsync(user, request.Role);
			if (!roleResult.Succeeded)
			{
				await _userManager.DeleteAsync(user); // Rollback user creation
				return Result<AuthenticationResponse>.Failure(
					L(LocalizationKeys.Role.AssignFailed, string.Join(", ", roleResult.Errors.Select(e => e.Description))),
					500
				);
			}

			// Generate tokens
			var roles = await _userManager.GetRolesAsync(user);
			var accessToken = _jwtTokenService.GenerateAccessToken(user, roles);
			var refreshToken = _jwtTokenService.GenerateRefreshToken();

			// Update refresh token
			user.RefreshToken = refreshToken;
			user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenExpirationDays);
			await _userManager.UpdateAsync(user);

			var response = new AuthenticationResponse
			{
				UserId = user.Id,
				Email = user.Email!,
				FirstName = user.FirstName,
				LastName = user.LastName,
				Roles = [.. roles],
				AccessToken = accessToken,
				RefreshToken = refreshToken,
				ExpiresAt = DateTime.UtcNow.AddMinutes(_jwtSettings.AccessTokenExpirationMinutes),
			};

			return Result<AuthenticationResponse>.Success(response, 201);
		}
		catch (Exception ex)
		{
			return Result<AuthenticationResponse>.Failure($"Registration failed: {ex.Message}", 500);
		}
	}
}
