using FluentValidation;
using PetWebsite.Domain.Constants;

namespace PetWebsite.Application.Features.PetAds.Commands.UploadPetAdImage;

public class UploadPetAdImageCommandValidator : AbstractValidator<UploadPetAdImageCommand>
{
	private static readonly string[] AllowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];
	private const long MaxFileSizeBytes = 3 * 1024 * 1024; // 3 MB

	public UploadPetAdImageCommandValidator()
	{
		RuleFor(x => x.File).NotNull().WithMessage(LocalizationKeys.File.FileNameCannotBeEmpty);

		RuleFor(x => x.File.Length)
			.GreaterThan(0)
			.WithMessage(LocalizationKeys.File.FileNameCannotBeEmpty)
			.LessThanOrEqualTo(MaxFileSizeBytes)
			.WithMessage(LocalizationKeys.File.FileSizeExceedsLimit);

		RuleFor(x => x.File.FileName).Must(HaveValidExtension).WithMessage(LocalizationKeys.PetAd.InvalidImageFormat);
	}

	private static bool HaveValidExtension(string fileName)
	{
		if (string.IsNullOrWhiteSpace(fileName))
			return false;

		var extension = Path.GetExtension(fileName).ToLowerInvariant();
		return AllowedExtensions.Contains(extension);
	}
}
