using FluentValidation;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Validators;
using PetWebsite.Domain.Constants;

namespace PetWebsite.Application.Features.PetAds.Commands.AskQuestion;

public class AskQuestionCommandValidator : BaseValidator<AskQuestionCommand>
{
	public AskQuestionCommandValidator(IStringLocalizer localizer)
		: base(localizer)
	{
		RuleFor(x => x.PetAdId).GreaterThan(0).WithMessage(L(LocalizationKeys.Validation.Required, "PetAdId"));

		RuleFor(x => x.Question)
			.NotEmpty()
			.WithMessage(L(LocalizationKeys.Validation.Required, "Question"))
			.MaximumLength(1000)
			.WithMessage(L(LocalizationKeys.Validation.MaxLength, "Question", "1000"));
	}
}
