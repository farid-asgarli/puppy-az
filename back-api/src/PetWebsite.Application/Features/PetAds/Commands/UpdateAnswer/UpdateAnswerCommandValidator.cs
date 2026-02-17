using FluentValidation;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Validators;
using PetWebsite.Domain.Constants;

namespace PetWebsite.Application.Features.PetAds.Commands.UpdateAnswer;

public class UpdateAnswerCommandValidator : BaseValidator<UpdateAnswerCommand>
{
	public UpdateAnswerCommandValidator(IStringLocalizer localizer)
		: base(localizer)
	{
		RuleFor(x => x.QuestionId)
			.GreaterThan(0)
			.WithMessage(L(LocalizationKeys.Validation.Required, "QuestionId"));

		RuleFor(x => x.Answer)
			.NotEmpty()
			.WithMessage(L(LocalizationKeys.Validation.Required, "Answer"))
			.MaximumLength(2000)
			.WithMessage(L(LocalizationKeys.Validation.MaxLength, "Answer", "2000"));
	}
}
