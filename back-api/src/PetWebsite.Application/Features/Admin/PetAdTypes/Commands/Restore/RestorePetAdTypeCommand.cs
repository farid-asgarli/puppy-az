using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Admin.PetAdTypes.Commands.Restore;

public record RestorePetAdTypeCommand(int Id) : ICommand<Result>;
