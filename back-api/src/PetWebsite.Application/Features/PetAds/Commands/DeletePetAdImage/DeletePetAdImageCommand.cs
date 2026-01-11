using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.PetAds.Commands.DeletePetAdImage;

/// <summary>
/// Command to delete an uploaded pet ad image.
/// Only the user who uploaded the image can delete it, and only if it's not yet attached to an ad.
/// </summary>
public record DeletePetAdImageCommand(int ImageId) : ICommand<Result>;
