using FluentValidation;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Validators;
using PetWebsite.Domain.Constants;

namespace PetWebsite.Application.Features.PetAds.Commands.UpdateQuestion;

public class UpdateQuestionCommandValidator : BaseValidator<UpdateQuestionCommand>
{
	public UpdateQuestionCommandValidator(IStringLocalizer localizer)
		: base(localizer)
	{
		RuleFor(x => x.QuestionId)
			.GreaterThan(0)
			.WithMessage(L(LocalizationKeys.Validation.Required, "QuestionId"));

		RuleFor(x => x.Question)
			.NotEmpty()
			.WithMessage(L(LocalizationKeys.Validation.Required, "Question"))
			.MaximumLength(1000)
			.WithMessage(L(LocalizationKeys.Validation.MaxLength, "Question", "1000"));
	}
}
