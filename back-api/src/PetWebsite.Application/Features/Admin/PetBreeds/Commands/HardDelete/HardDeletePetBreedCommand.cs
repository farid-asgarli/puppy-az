using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Admin.PetBreeds.Commands.HardDelete;

public record HardDeletePetBreedCommand(int Id) : ICommand<Result>;
