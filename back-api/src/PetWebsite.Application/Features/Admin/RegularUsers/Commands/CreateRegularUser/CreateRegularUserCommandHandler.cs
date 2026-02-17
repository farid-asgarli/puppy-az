using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Application.Features.Admin.RegularUsers.Commands.CreateRegularUser;

/// <summary>
/// Handler for CreateRegularUserCommand.
/// Creates a new regular user (consumer) without password (phone-based login).
/// </summary>
public class CreateRegularUserCommandHandler(
	UserManager<User> userManager,
	IApplicationDbContext dbContext,
	IStringLocalizer<CreateRegularUserCommandHandler> localizer,
	ILogger<CreateRegularUserCommandHandler> logger)
	: IRequestHandler<CreateRegularUserCommand, Result<Guid>>
{
	public async Task<Result<Guid>> Handle(CreateRegularUserCommand request, CancellationToken cancellationToken)
	{
		try
		{
			// Check if user with this phone number already exists
			var existingUser = await userManager.Users
				.FirstOrDefaultAsync(u => u.PhoneNumber == request.PhoneNumber, cancellationToken);

			if (existingUser != null)
			{
				return Result<Guid>.Failure(localizer["UserWithPhoneAlreadyExists", request.PhoneNumber]);
			}

			// Create new user
			var user = new User
			{
				PhoneNumber = request.PhoneNumber,
				PhoneNumberConfirmed = true, // Auto-confirm for admin-created users
				UserName = request.PhoneNumber, // Use phone as username
				Email = $"{Guid.NewGuid()}@placeholder.local", // Placeholder email
				EmailConfirmed = false,
				FirstName = request.FirstName ?? "User",
				LastName = request.LastName ?? "",
				IsActive = true,
				IsCreatedByAdmin = true,
				CreatedAt = DateTime.UtcNow
			};

			// Create user without password (phone-based auth)
			var result = await userManager.CreateAsync(user);

			if (!result.Succeeded)
			{
				var errors = string.Join(", ", result.Errors.Select(e => e.Description));
				logger.LogError("Failed to create user: {Errors}", errors);
				return Result<Guid>.Failure(localizer["UserCreationFailed", errors]);
			}

			logger.LogInformation("Admin created new regular user {UserId} with phone {PhoneNumber}", 
				user.Id, request.PhoneNumber);

			return Result<Guid>.Success(user.Id);
		}
		catch (Exception ex)
		{
			logger.LogError(ex, "Error creating regular user with phone {PhoneNumber}", request.PhoneNumber);
			return Result<Guid>.Failure(localizer["UnexpectedError"]);
		}
	}
}
