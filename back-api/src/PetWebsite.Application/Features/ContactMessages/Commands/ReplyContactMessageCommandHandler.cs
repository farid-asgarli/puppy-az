using Microsoft.EntityFrameworkCore;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Domain.Enums;

namespace PetWebsite.Application.Features.ContactMessages.Commands;

public class ReplyContactMessageCommandHandler(
	IApplicationDbContext dbContext,
	ICurrentUserService currentUserService
) : ICommandHandler<ReplyContactMessageCommand, bool>
{
	public async Task<bool> Handle(ReplyContactMessageCommand request, CancellationToken ct)
	{
		var message = await dbContext.ContactMessages
			.FirstOrDefaultAsync(m => m.Id == request.Id, ct);

		if (message == null)
			return false;

		message.AdminReply = request.Reply;
		message.Status = ContactMessageStatus.Replied;
		message.RepliedAt = DateTime.UtcNow;
		message.RepliedByAdminId = currentUserService.AdminUserId;
		message.UpdatedAt = DateTime.UtcNow;

		await dbContext.SaveChangesAsync(ct);

		// TODO: Send email notification to sender if they have email

		return true;
	}
}
