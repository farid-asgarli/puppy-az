using Microsoft.EntityFrameworkCore;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Domain.Enums;

namespace PetWebsite.Application.Features.ContactMessages.Queries;

public class GetContactMessageQueryHandler(
	IApplicationDbContext dbContext,
	ICurrentUserService currentUserService
) : ICommandHandler<GetContactMessageQuery, ContactMessageDetailDto?>
{
	public async Task<ContactMessageDetailDto?> Handle(GetContactMessageQuery request, CancellationToken ct)
	{
		var message = await dbContext.ContactMessages
			.Include(m => m.User)
			.FirstOrDefaultAsync(m => m.Id == request.Id, ct);

		if (message == null)
			return null;

		// Mark as read if requested and not already read
		if (request.MarkAsRead && message.Status == ContactMessageStatus.New)
		{
			message.Status = ContactMessageStatus.Read;
			message.ReadAt = DateTime.UtcNow;
			message.ReadByAdminId = currentUserService.AdminUserId;
			await dbContext.SaveChangesAsync(ct);
		}

		// Get admin names if needed
		string? readByAdminName = null;
		string? repliedByAdminName = null;

		if (message.ReadByAdminId.HasValue)
		{
			var readByAdmin = await dbContext.AdminUsers
				.Where(a => a.Id == message.ReadByAdminId.Value)
				.Select(a => new { a.FirstName, a.LastName })
				.FirstOrDefaultAsync(ct);
			if (readByAdmin != null)
				readByAdminName = $"{readByAdmin.FirstName} {readByAdmin.LastName}".Trim();
		}

		if (message.RepliedByAdminId.HasValue)
		{
			var repliedByAdmin = await dbContext.AdminUsers
				.Where(a => a.Id == message.RepliedByAdminId.Value)
				.Select(a => new { a.FirstName, a.LastName })
				.FirstOrDefaultAsync(ct);
			if (repliedByAdmin != null)
				repliedByAdminName = $"{repliedByAdmin.FirstName} {repliedByAdmin.LastName}".Trim();
		}

		// Try to find a matching user by phone number if no UserId and phone is provided
		UserBriefDto? matchedUserByPhone = null;
		if (!message.UserId.HasValue && !string.IsNullOrWhiteSpace(message.SenderPhone))
		{
			// Normalize phone number for comparison
			var normalizedPhone = NormalizePhoneNumber(message.SenderPhone);
			
			var matchedUser = await dbContext.RegularUsers
				.Where(u => u.PhoneNumber != null && 
					(u.PhoneNumber == message.SenderPhone || 
					 u.PhoneNumber == normalizedPhone ||
					 u.PhoneNumber.Replace(" ", "").Replace("-", "").Replace("(", "").Replace(")", "") == normalizedPhone))
				.Select(u => new 
				{
					u.Id,
					u.FirstName,
					u.LastName,
					u.PhoneNumber,
					u.Email,
					u.ProfilePictureUrl,
					u.CreatedAt,
					u.EmailConfirmed,
					TotalAdsCount = u.PetAds.Count
				})
				.FirstOrDefaultAsync(ct);

			if (matchedUser != null)
			{
				matchedUserByPhone = new UserBriefDto
				{
					Id = matchedUser.Id,
					FullName = $"{matchedUser.FirstName} {matchedUser.LastName}".Trim(),
					PhoneNumber = matchedUser.PhoneNumber,
					Email = matchedUser.Email,
					ProfilePictureUrl = matchedUser.ProfilePictureUrl,
					CreatedAt = matchedUser.CreatedAt,
					IsVerified = matchedUser.EmailConfirmed,
					TotalAdsCount = matchedUser.TotalAdsCount
				};
			}
		}

		// Build User DTO with extended info
		UserBriefDto? userDto = null;
		if (message.User != null)
		{
			var userAdsCount = await dbContext.PetAds
				.CountAsync(pa => pa.UserId == message.User.Id, ct);

			userDto = new UserBriefDto
			{
				Id = message.User.Id,
				FullName = $"{message.User.FirstName} {message.User.LastName}".Trim(),
				PhoneNumber = message.User.PhoneNumber,
				Email = message.User.Email,
				ProfilePictureUrl = message.User.ProfilePictureUrl,
				CreatedAt = message.User.CreatedAt,
				IsVerified = message.User.EmailConfirmed,
				TotalAdsCount = userAdsCount
			};
		}

		return new ContactMessageDetailDto
		{
			Id = message.Id,
			SenderName = message.SenderName,
			SenderEmail = message.SenderEmail,
			SenderPhone = message.SenderPhone,
			UserId = message.UserId,
			User = userDto,
			MatchedUserByPhone = matchedUserByPhone,
			Subject = message.Subject,
			Message = message.Message,
			MessageType = message.MessageType,
			Status = message.Status,
			LanguageCode = message.LanguageCode,
			AdminReply = message.AdminReply,
			ReadAt = message.ReadAt,
			ReadByAdminId = message.ReadByAdminId,
			ReadByAdminName = readByAdminName,
			RepliedAt = message.RepliedAt,
			RepliedByAdminId = message.RepliedByAdminId,
			RepliedByAdminName = repliedByAdminName,
			IpAddress = message.IpAddress,
			UserAgent = message.UserAgent,
			SourceUrl = message.SourceUrl,
			InternalNotes = message.InternalNotes,
			IsSpam = message.IsSpam,
			IsStarred = message.IsStarred,
			IsArchived = message.IsArchived,
			CreatedAt = message.CreatedAt,
			UpdatedAt = message.UpdatedAt
		};
	}

	private static string NormalizePhoneNumber(string phone)
	{
		// Remove all non-digit characters
		var digits = new string(phone.Where(char.IsDigit).ToArray());
		
		// If starts with 994, keep it; otherwise add it
		if (digits.StartsWith("994"))
			return "+" + digits;
		
		// If starts with 0, replace with +994
		if (digits.StartsWith("0"))
			return "+994" + digits[1..];
		
		// Otherwise assume it's a local number
		return "+994" + digits;
	}
}
