using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Enums;

namespace PetWebsite.Application.Features.Admin.PetAds.Commands.UpdatePetAd;

/// <summary>
/// Command to update a pet ad by admin.
/// Admin can update any pet ad regardless of ownership.
/// </summary>
public record UpdatePetAdByAdminCommand(
	int Id,
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
) : ICommand<Result>;
