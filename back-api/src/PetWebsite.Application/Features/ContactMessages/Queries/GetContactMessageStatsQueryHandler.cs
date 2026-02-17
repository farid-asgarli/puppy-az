using Microsoft.EntityFrameworkCore;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Domain.Enums;

namespace PetWebsite.Application.Features.ContactMessages.Queries;

public class GetContactMessageStatsQueryHandler(IApplicationDbContext dbContext)
	: ICommandHandler<GetContactMessageStatsQuery, ContactMessageStatsDto>
{
	public async Task<ContactMessageStatsDto> Handle(GetContactMessageStatsQuery request, CancellationToken ct)
	{
		var messages = await dbContext.ContactMessages
			.AsNoTracking()
			.Select(m => new
			{
				m.Status,
				m.MessageType,
				m.IsSpam,
				m.IsStarred,
				m.IsArchived
			})
			.ToListAsync(ct);

		var stats = new ContactMessageStatsDto
		{
			TotalCount = messages.Count,
			NewCount = messages.Count(m => m.Status == ContactMessageStatus.New && !m.IsSpam && !m.IsArchived),
			ReadCount = messages.Count(m => m.Status == ContactMessageStatus.Read && !m.IsSpam && !m.IsArchived),
			RepliedCount = messages.Count(m => m.Status == ContactMessageStatus.Replied && !m.IsSpam && !m.IsArchived),
			SpamCount = messages.Count(m => m.IsSpam),
			StarredCount = messages.Count(m => m.IsStarred && !m.IsSpam),
			ArchivedCount = messages.Count(m => m.IsArchived && !m.IsSpam),
			ByType = messages
				.Where(m => !m.IsSpam)
				.GroupBy(m => m.MessageType)
				.ToDictionary(g => g.Key, g => g.Count())
		};

		return stats;
	}
}
