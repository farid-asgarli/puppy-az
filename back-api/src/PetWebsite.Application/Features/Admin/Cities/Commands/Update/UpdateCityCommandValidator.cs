using FluentValidation;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Validators;
using PetWebsite.Domain.Constants;

namespace PetWebsite.Application.Features.Admin.Cities.Commands.Update;

public class UpdateCityCommandValidator : BaseValidator<UpdateCityCommand>
{
	public UpdateCityCommandValidator(IStringLocalizer localizer)
		: base(localizer)
	{
		RuleFor(x => x.Id).GreaterThan(0).WithMessage(L(LocalizationKeys.City.IdInvalid));

		RuleFor(x => x.Name)
			.NotEmpty()
			.WithMessage(L(LocalizationKeys.City.NameRequired))
			.MaximumLength(100)
			.WithMessage(L(LocalizationKeys.City.NameMaxLength));
	}
}
