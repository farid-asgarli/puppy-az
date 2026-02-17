using FluentValidation;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Validators;
using PetWebsite.Domain.Constants;

namespace PetWebsite.Application.Features.Admin.Districts.Commands.Update;

public class UpdateDistrictCommandValidator : BaseValidator<UpdateDistrictCommand>
{
	public UpdateDistrictCommandValidator(IStringLocalizer localizer)
		: base(localizer)
	{
		RuleFor(x => x.Id).GreaterThan(0).WithMessage(L(LocalizationKeys.District.IdInvalid));

		RuleFor(x => x.NameAz)
			.NotEmpty()
			.WithMessage(L(LocalizationKeys.District.NameRequired))
			.MaximumLength(100)
			.WithMessage(L(LocalizationKeys.District.NameMaxLength));

		RuleFor(x => x.NameEn)
			.NotEmpty()
			.WithMessage(L(LocalizationKeys.District.NameRequired))
			.MaximumLength(100)
			.WithMessage(L(LocalizationKeys.District.NameMaxLength));

		RuleFor(x => x.NameRu)
			.NotEmpty()
			.WithMessage(L(LocalizationKeys.District.NameRequired))
			.MaximumLength(100)
			.WithMessage(L(LocalizationKeys.District.NameMaxLength));

		RuleFor(x => x.CityId)
			.GreaterThan(0)
			.WithMessage(L(LocalizationKeys.District.CityRequired));

		RuleFor(x => x.DisplayOrder)
			.GreaterThanOrEqualTo(0)
			.WithMessage("Display order must be a non-negative number.");
	}
}
