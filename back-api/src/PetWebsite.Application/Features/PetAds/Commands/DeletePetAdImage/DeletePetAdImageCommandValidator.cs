using FluentValidation;
using PetWebsite.Domain.Constants;

namespace PetWebsite.Application.Features.PetAds.Commands.DeletePetAdImage;

public class DeletePetAdImageCommandValidator : AbstractValidator<DeletePetAdImageCommand>
{
	public DeletePetAdImageCommandValidator()
	{
		RuleFor(x => x.ImageId).GreaterThan(0).WithMessage(LocalizationKeys.PetAd.ImageIdInvalid);
	}
}
