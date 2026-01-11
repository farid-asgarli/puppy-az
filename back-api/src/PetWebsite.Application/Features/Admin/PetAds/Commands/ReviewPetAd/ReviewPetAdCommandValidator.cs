using FluentValidation;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Validators;
using PetWebsite.Domain.Constants;
using PetWebsite.Domain.Enums;

namespace PetWebsite.Application.Features.Admin.PetAds.Commands.ReviewPetAd;

public class ReviewPetAdCommandValidator : BaseValidator<ReviewPetAdCommand>
{
	public ReviewPetAdCommandValidator(IStringLocalizer localizer)
		: base(localizer)
	{
		RuleFor(x => x.Id).GreaterThan(0).WithMessage(L(LocalizationKeys.PetAd.IdInvalid));

		RuleFor(x => x.Status).IsInEnum().WithMessage(L(LocalizationKeys.PetAd.InvalidStatus));

		RuleFor(x => x.RejectionReason)
			.NotEmpty()
			.When(x => x.Status == PetAdStatus.Rejected)
			.WithMessage(L(LocalizationKeys.PetAd.RejectionReasonRequired))
			.MaximumLength(500)
			.WithMessage(L(LocalizationKeys.PetAd.RejectionReasonMaxLength));
	}
}
