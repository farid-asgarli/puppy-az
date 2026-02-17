using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Admin.PetAds.Commands.SetPetAdVip;

/// <summary>
/// Command to set or remove VIP status for a pet ad.
/// VIP ads appear at the top only within their own category.
/// </summary>
/// <param name="Id">The pet ad ID.</param>
/// <param name="IsVip">Whether to set or remove VIP status.</param>
/// <param name="DurationInDays">Duration in days (required when setting VIP status).</param>
public record SetPetAdVipCommand(int Id, bool IsVip, int? DurationInDays = null) : ICommand<Result>;
