using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Admin.Districts.Commands.Restore;

public record RestoreDistrictCommand(int Id) : ICommand<Result>;
