using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Enums;

namespace PetWebsite.Application.Features.PetAds.Commands.SubmitPetAd;

public record SubmitPetAdCommand(
	string Title,
	string Description,
	int AgeInMonths,
	PetGender Gender,
	PetAdType AdType,
	string Color,
	decimal? Weight,
	PetSize? Size,
	decimal Price,
	int CityId,
	int PetBreedId,
	List<int>? ImageIds = null
) : ICommand<Result<int>>;
