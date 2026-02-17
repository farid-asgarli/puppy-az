using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Admin.Districts.Commands.Update;

public record UpdateDistrictCommand(
	int Id,
	string NameAz,
	string NameEn,
	string NameRu,
	int CityId,
	int DisplayOrder,
	bool IsActive
) : ICommand<Result>;
