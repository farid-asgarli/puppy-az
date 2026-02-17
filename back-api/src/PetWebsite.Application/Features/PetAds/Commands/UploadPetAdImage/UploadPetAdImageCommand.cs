using Microsoft.AspNetCore.Http;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.PetAds.Commands.UploadPetAdImage;

/// <summary>
/// Command to upload an image for a pet advertisement.
/// Image is uploaded to storage and metadata is saved with ownership tracking.
/// When UploadForUserId is provided (admin upload), the image is owned by that user instead of the current user.
/// </summary>
public record UploadPetAdImageCommand(IFormFile File, Guid? UploadForUserId = null) : ICommand<Result<PetAdImageDto>>;
