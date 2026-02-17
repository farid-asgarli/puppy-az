using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Admin.Districts.Commands.SoftDelete;

public record SoftDeleteDistrictCommand(int Id, Guid? DeletedBy = null) : ICommand<Result>;
