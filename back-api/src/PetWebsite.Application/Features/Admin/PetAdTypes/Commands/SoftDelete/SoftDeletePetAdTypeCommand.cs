using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Admin.PetAdTypes.Commands.SoftDelete;

public record SoftDeletePetAdTypeCommand(int Id, Guid? DeletedBy = null) : ICommand<Result>;
