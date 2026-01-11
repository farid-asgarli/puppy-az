using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Admin.PetBreeds.Commands.SoftDelete;

public record SoftDeletePetBreedCommand(int Id, Guid? DeletedBy = null) : ICommand<Result>;
