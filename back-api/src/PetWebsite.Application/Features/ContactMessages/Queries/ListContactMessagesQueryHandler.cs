using Common.Repository.Abstraction;
using Microsoft.EntityFrameworkCore;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Enums;

namespace PetWebsite.Application.Features.ContactMessages.Queries;

public class ListContactMessagesQueryHandler(
	IApplicationDbContext dbContext,
	IDynamicQueryRepository queryRepo
) : ICommandHandler<ListContactMessagesQuery, PaginatedResult<ContactMessageListItemDto>>
{
	public async Task<PaginatedResult<ContactMessageListItemDto>> Handle(
		ListContactMessagesQuery request,
		CancellationToken ct)
	{
		var query = dbContext.ContactMessages.AsNoTracking().AsQueryable();

		// Apply filters
		if (request.Status.HasValue)
		{
			var status = (ContactMessageStatus)request.Status.Value;
			query = query.Where(m => m.Status == status);
		}

		if (request.MessageType.HasValue)
		{
			var messageType = (ContactMessageType)request.MessageType.Value;
			query = query.Where(m => m.MessageType == messageType);
		}

		if (request.IsSpam.HasValue)
		{
			query = query.Where(m => m.IsSpam == request.IsSpam.Value);
		}

		if (request.IsStarred.HasValue)
		{
			query = query.Where(m => m.IsStarred == request.IsStarred.Value);
		}

		if (request.IsArchived.HasValue)
		{
			query = query.Where(m => m.IsArchived == request.IsArchived.Value);
		}

		if (!string.IsNullOrWhiteSpace(request.Search))
		{
			var search = request.Search.ToLower();
			query = query.Where(m =>
				(m.SenderName != null && m.SenderName.ToLower().Contains(search)) ||
				(m.SenderEmail != null && m.SenderEmail.ToLower().Contains(search)) ||
				(m.SenderPhone != null && m.SenderPhone.Contains(search)) ||
				(m.Subject != null && m.Subject.ToLower().Contains(search)) ||
				m.Message.ToLower().Contains(search)
			);
		}

		var projected = query.Select(m => new ContactMessageListItemDto
		{
			Id = m.Id,
			SenderName = m.SenderName,
			SenderEmail = m.SenderEmail,
			SenderPhone = m.SenderPhone,
			UserId = m.UserId,
			Subject = m.Subject,
			MessagePreview = m.Message.Length > 100 ? m.Message.Substring(0, 100) + "..." : m.Message,
			MessageType = m.MessageType,
			Status = m.Status,
			LanguageCode = m.LanguageCode,
			IsSpam = m.IsSpam,
			IsStarred = m.IsStarred,
			IsArchived = m.IsArchived,
			HasReply = m.AdminReply != null,
			CreatedAt = m.CreatedAt
		});

		// Default ordering - newest first
		projected = projected.OrderByDescending(m => m.CreatedAt);

		var (items, count) = await queryRepo
			.WithQuery(projected)
			.ApplyFilters(request.Filter)
			.ApplyPagination(request.Pagination)
			.ToListWithCountAsync(ct);

		return new PaginatedResult<ContactMessageListItemDto>
		{
			Items = items,
			TotalCount = count,
			PageNumber = request.Pagination?.Number ?? 1,
			PageSize = request.Pagination?.Size ?? count,
		};
	}
}
