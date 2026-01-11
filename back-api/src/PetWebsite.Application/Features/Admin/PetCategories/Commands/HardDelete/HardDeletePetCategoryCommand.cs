using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Admin.PetCategories.Commands.HardDelete;

public record HardDeletePetCategoryCommand(int Id) : ICommand<Result>;
