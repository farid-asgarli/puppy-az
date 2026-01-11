using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Admin.Cities.Commands.Create;

public record CreateCityCommand(string Name, bool IsActive = true) : ICommand<Result<int>>;
