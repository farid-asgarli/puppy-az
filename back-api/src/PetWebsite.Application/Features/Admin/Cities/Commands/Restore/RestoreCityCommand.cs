using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Admin.Cities.Commands.Restore;

public record RestoreCityCommand(int Id) : ICommand<Result>;
