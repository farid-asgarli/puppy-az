using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Admin.PetCategories.Commands.SoftDelete;

public record SoftDeletePetCategoryCommand(int Id, Guid? DeletedBy = null) : ICommand<Result>;
