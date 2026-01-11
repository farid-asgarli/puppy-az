using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Admin.Cities.Commands.HardDelete;

public record HardDeleteCityCommand(int Id) : ICommand<Result>;
