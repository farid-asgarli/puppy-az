using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Admin.Districts.Commands.Create;

public record CreateDistrictCommand(
	string NameAz,
	string NameEn,
	string NameRu,
	int CityId,
	int DisplayOrder = 100,
	bool IsActive = true
) : ICommand<Result<int>>;
