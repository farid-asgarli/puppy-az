using FluentValidation;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Validators;
using PetWebsite.Domain.Constants;

namespace PetWebsite.Application.Features.Users.Commands.UpdateProfile;

public class UpdateUserProfileCommandValidator : BaseValidator<UpdateUserProfileCommand>
{
	public UpdateUserProfileCommandValidator(IStringLocalizer localizer)
		: base(localizer)
	{
		RuleFor(x => x.FirstName)
			.NotEmpty()
			.WithMessage(L(LocalizationKeys.User.FirstNameRequired))
			.MaximumLength(100)
			.WithMessage(L(LocalizationKeys.User.FirstNameMaxLength, 100));

		RuleFor(x => x.LastName)
			.NotEmpty()
			.WithMessage(L(LocalizationKeys.User.LastNameRequired))
			.MaximumLength(100)
			.WithMessage(L(LocalizationKeys.User.LastNameMaxLength, 100));

		RuleFor(x => x.PhoneNumber)
			.MaximumLength(20)
			.WithMessage(L(LocalizationKeys.User.PhoneNumberMaxLength, 20))
			.When(x => !string.IsNullOrEmpty(x.PhoneNumber));

		RuleFor(x => x.ProfilePictureUrl)
			.MaximumLength(500)
			.WithMessage(L(LocalizationKeys.User.ProfilePictureUrlMaxLength, 500))
			.When(x => !string.IsNullOrEmpty(x.ProfilePictureUrl));
	}
}
