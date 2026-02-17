using FluentValidation;
using PetWebsite.Domain.Constants;

namespace PetWebsite.Application.Features.Messages.Commands.UpdateMessage;

public class UpdateMessageCommandValidator : AbstractValidator<UpdateMessageCommand>
{
    public UpdateMessageCommandValidator()
    {
        RuleFor(x => x.MessageId)
            .GreaterThan(0)
            .WithMessage(LocalizationKeys.Message.NotFound);

        RuleFor(x => x.Content)
            .NotEmpty()
            .WithMessage(LocalizationKeys.Message.ContentRequired)
            .MaximumLength(1000)
            .WithMessage(LocalizationKeys.Message.ContentTooLong);
    }
}
