using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Application.Features.ContactMessages.Commands;

public class CreateContactMessageCommandHandler(IApplicationDbContext dbContext)
	: ICommandHandler<CreateContactMessageCommand, int>
{
	public async Task<int> Handle(CreateContactMessageCommand request, CancellationToken ct)
	{
		var message = new ContactMessage
		{
			SenderName = request.SenderName,
			SenderEmail = request.SenderEmail,
			SenderPhone = request.SenderPhone,
			UserId = request.UserId,
			Subject = request.Subject,
			Message = request.Message,
			MessageType = request.MessageType,
			LanguageCode = request.LanguageCode,
			IpAddress = request.IpAddress,
			UserAgent = request.UserAgent,
			SourceUrl = request.SourceUrl,
			CreatedAt = DateTime.UtcNow
		};

		dbContext.ContactMessages.Add(message);
		await dbContext.SaveChangesAsync(ct);

		return message.Id;
	}
}
