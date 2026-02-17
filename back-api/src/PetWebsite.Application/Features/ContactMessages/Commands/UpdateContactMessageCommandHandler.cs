using Microsoft.EntityFrameworkCore;
using PetWebsite.Application.Common.Interfaces;

namespace PetWebsite.Application.Features.ContactMessages.Commands;

public class UpdateContactMessageCommandHandler(IApplicationDbContext dbContext)
	: ICommandHandler<UpdateContactMessageCommand, bool>
{
	public async Task<bool> Handle(UpdateContactMessageCommand request, CancellationToken ct)
	{
		var message = await dbContext.ContactMessages
			.FirstOrDefaultAsync(m => m.Id == request.Id, ct);

		if (message == null)
			return false;

		if (request.Status.HasValue)
			message.Status = request.Status.Value;

		if (request.IsSpam.HasValue)
			message.IsSpam = request.IsSpam.Value;

		if (request.IsStarred.HasValue)
			message.IsStarred = request.IsStarred.Value;

		if (request.IsArchived.HasValue)
			message.IsArchived = request.IsArchived.Value;

		if (request.InternalNotes != null)
			message.InternalNotes = request.InternalNotes;

		message.UpdatedAt = DateTime.UtcNow;

		await dbContext.SaveChangesAsync(ct);

		return true;
	}
}
