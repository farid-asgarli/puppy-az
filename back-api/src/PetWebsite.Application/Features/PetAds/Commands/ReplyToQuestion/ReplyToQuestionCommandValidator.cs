using FluentValidation;

namespace PetWebsite.Application.Features.PetAds.Commands.ReplyToQuestion;

public class ReplyToQuestionCommandValidator : AbstractValidator<ReplyToQuestionCommand>
{
	public ReplyToQuestionCommandValidator()
	{
		RuleFor(x => x.QuestionId)
			.GreaterThan(0);

		RuleFor(x => x.Text)
			.NotEmpty()
			.MaximumLength(1000);
	}
}
