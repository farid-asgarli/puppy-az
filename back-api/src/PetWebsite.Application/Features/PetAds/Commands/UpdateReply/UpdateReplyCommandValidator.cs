using FluentValidation;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Validators;
using PetWebsite.Domain.Constants;

namespace PetWebsite.Application.Features.PetAds.Commands.UpdateReply;

public class UpdateReplyCommandValidator : BaseValidator<UpdateReplyCommand>
{
	public UpdateReplyCommandValidator(IStringLocalizer localizer)
		: base(localizer)
	{
		RuleFor(x => x.ReplyId)
			.GreaterThan(0)
			.WithMessage(L(LocalizationKeys.Validation.Required, "ReplyId"));

		RuleFor(x => x.Text)
			.NotEmpty()
			.WithMessage(L(LocalizationKeys.Validation.Required, "Text"))
			.MaximumLength(1000)
			.WithMessage(L(LocalizationKeys.Validation.MaxLength, "Text", "1000"));
	}
}
