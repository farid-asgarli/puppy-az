using FluentValidation;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Validators;
using PetWebsite.Domain.Constants;

namespace PetWebsite.Application.Features.Admin.Cities.Commands.Create;

public class CreateCityCommandValidator : BaseValidator<CreateCityCommand>
{
	public CreateCityCommandValidator(IStringLocalizer localizer)
		: base(localizer)
	{
		RuleFor(x => x.NameAz)
			.NotEmpty()
			.WithMessage(L(LocalizationKeys.City.NameRequired))
			.MaximumLength(100)
			.WithMessage(L(LocalizationKeys.City.NameMaxLength));

		RuleFor(x => x.NameEn)
			.NotEmpty()
			.WithMessage(L(LocalizationKeys.City.NameRequired))
			.MaximumLength(100)
			.WithMessage(L(LocalizationKeys.City.NameMaxLength));

		RuleFor(x => x.NameRu)
			.NotEmpty()
			.WithMessage(L(LocalizationKeys.City.NameRequired))
			.MaximumLength(100)
			.WithMessage(L(LocalizationKeys.City.NameMaxLength));

		RuleFor(x => x.DisplayOrder)
			.GreaterThanOrEqualTo(0)
			.WithMessage("Display order must be a non-negative number.");
	}
}
