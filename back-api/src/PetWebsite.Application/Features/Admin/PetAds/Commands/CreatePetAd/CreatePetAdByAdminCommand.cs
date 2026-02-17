using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Enums;

namespace PetWebsite.Application.Features.Admin.PetAds.Commands.CreatePetAd;

/// <summary>
/// Command to create a new pet ad by admin on behalf of a user.
/// The ad will be immediately published without pending review.
/// </summary>
public record CreatePetAdByAdminCommand(
	Guid UserId, // The user on whose behalf the ad is being created
	string Title,
	string Description,
	int? AgeInMonths,
	PetGender? Gender,
	PetAdType AdType,
	string Color,
	decimal? Weight,
	PetSize? Size,
	decimal Price,
	int CityId,
	int? DistrictId,
	int? PetBreedId,
	int? PetCategoryId,
	List<int>? ImageIds = null
) : ICommand<Result<int>>;
