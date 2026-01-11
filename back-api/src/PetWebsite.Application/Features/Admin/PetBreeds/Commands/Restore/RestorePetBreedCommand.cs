using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Admin.PetBreeds.Commands.Restore;

public record RestorePetBreedCommand(int Id) : ICommand<Result>;
