using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Admin.Cities.Commands.Create;

public record CreateCityCommand(
	string NameAz,
	string NameEn,
	string NameRu,
	bool IsMajorCity = false,
	int DisplayOrder = 100,
	bool IsActive = true
) : ICommand<Result<int>>;
