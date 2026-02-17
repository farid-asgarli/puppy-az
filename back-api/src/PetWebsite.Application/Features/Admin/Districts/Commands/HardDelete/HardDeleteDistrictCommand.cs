using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Admin.Districts.Commands.HardDelete;

public record HardDeleteDistrictCommand(int Id) : ICommand<Result>;
