using Microsoft.EntityFrameworkCore;
using PetWebsite.Application.Common.Interfaces;

namespace PetWebsite.Application.Features.ContactMessages.Commands;

public class DeleteContactMessageCommandHandler(IApplicationDbContext dbContext)
	: ICommandHandler<DeleteContactMessageCommand, bool>
{
	public async Task<bool> Handle(DeleteContactMessageCommand request, CancellationToken ct)
	{
		var message = await dbContext.ContactMessages
			.FirstOrDefaultAsync(m => m.Id == request.Id, ct);

		if (message == null)
			return false;

		dbContext.ContactMessages.Remove(message);
		await dbContext.SaveChangesAsync(ct);

		return true;
	}
}
