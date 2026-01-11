using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Admin.Cities.Commands.SoftDelete;

public record SoftDeleteCityCommand(int Id, Guid? DeletedBy = null) : ICommand<Result>;
