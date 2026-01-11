using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Admin.PetCategories.Commands.Restore;

public record RestorePetCategoryCommand(int Id) : ICommand<Result>;
