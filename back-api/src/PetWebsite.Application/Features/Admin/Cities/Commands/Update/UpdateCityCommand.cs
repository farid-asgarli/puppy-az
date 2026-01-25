using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Admin.Cities.Commands.Update;

public record UpdateCityCommand(
	int Id,
	string NameAz,
	string NameEn,
	string NameRu,
	bool IsMajorCity,
	int DisplayOrder,
	bool IsActive
) : ICommand<Result>;
