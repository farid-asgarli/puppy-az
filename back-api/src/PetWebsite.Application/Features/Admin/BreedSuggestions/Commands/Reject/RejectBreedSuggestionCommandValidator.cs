using FluentValidation;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Validators;
using PetWebsite.Domain.Constants;

namespace PetWebsite.Application.Features.Admin.BreedSuggestions.Commands.Reject;

public class RejectBreedSuggestionCommandValidator : BaseValidator<RejectBreedSuggestionCommand>
{
	public RejectBreedSuggestionCommandValidator(IStringLocalizer localizer) : base(localizer)
	{
		RuleFor(x => x.SuggestionId)
			.GreaterThan(0).WithMessage(L(LocalizationKeys.BreedSuggestion.IdInvalid));

		RuleFor(x => x.AdminNote)
			.MaximumLength(500).When(x => x.AdminNote != null)
			.WithMessage(L(LocalizationKeys.BreedSuggestion.AdminNoteMaxLength));
	}
}
