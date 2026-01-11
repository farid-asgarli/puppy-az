using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Enums;

namespace PetWebsite.Application.Features.Admin.PetAds.Commands.ReviewPetAd;

public record ReviewPetAdCommand(int Id, PetAdStatus Status, string? RejectionReason = null) : ICommand<Result>;
