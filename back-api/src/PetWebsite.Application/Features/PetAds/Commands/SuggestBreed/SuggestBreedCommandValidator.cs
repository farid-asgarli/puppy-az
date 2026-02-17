using FluentValidation;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Validators;
using PetWebsite.Domain.Constants;

namespace PetWebsite.Application.Features.PetAds.Commands.SuggestBreed;

public class SuggestBreedCommandValidator : BaseValidator<SuggestBreedCommand>
{
	public SuggestBreedCommandValidator(IStringLocalizer localizer) : base(localizer)
	{
		RuleFor(x => x.Name)
			.NotEmpty().WithMessage(L(LocalizationKeys.BreedSuggestion.NameRequired))
			.MaximumLength(100).WithMessage(L(LocalizationKeys.BreedSuggestion.NameMaxLength));

		RuleFor(x => x.PetCategoryId)
			.GreaterThan(0).WithMessage(L(LocalizationKeys.PetBreed.CategoryIdInvalid));
	}
}
