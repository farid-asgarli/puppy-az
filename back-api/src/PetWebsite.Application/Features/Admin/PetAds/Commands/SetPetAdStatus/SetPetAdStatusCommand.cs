using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Enums;

namespace PetWebsite.Application.Features.Admin.PetAds.Commands.SetPetAdStatus;

/// <summary>
/// Command to set the status of a pet advertisement (admin only).
/// </summary>
public record SetPetAdStatusCommand(int Id, PetAdStatus Status) : ICommand<Result>;
