using FluentValidation;
using PetWebsite.Domain.Constants;

namespace PetWebsite.Application.Features.Messages.Commands.DeleteMessage;

public class DeleteMessageCommandValidator : AbstractValidator<DeleteMessageCommand>
{
    public DeleteMessageCommandValidator()
    {
        RuleFor(x => x.MessageId)
            .GreaterThan(0)
            .WithMessage(LocalizationKeys.Message.NotFound);
    }
}
