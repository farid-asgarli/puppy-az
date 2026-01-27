using FluentValidation;
using PetWebsite.Domain.Constants;

namespace PetWebsite.Application.Features.Messages.Commands.SendMessage;

public class SendMessageCommandValidator : AbstractValidator<SendMessageCommand>
{
	public SendMessageCommandValidator()
	{
		RuleFor(x => x.ReceiverId)
			.NotEmpty()
			.WithMessage(LocalizationKeys.Message.ReceiverRequired);

		RuleFor(x => x.PetAdId)
			.GreaterThan(0)
			.WithMessage(LocalizationKeys.PetAd.IdInvalid);

		RuleFor(x => x.Content)
			.NotEmpty()
			.WithMessage(LocalizationKeys.Message.ContentRequired)
			.MaximumLength(1000)
			.WithMessage(LocalizationKeys.Message.ContentTooLong);
	}
}
