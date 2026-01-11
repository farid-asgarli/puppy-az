using Microsoft.AspNetCore.Http;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.PetAds.Commands.UploadPetAdImage;

/// <summary>
/// Command to upload an image for a pet advertisement.
/// Image is uploaded to storage and metadata is saved with ownership tracking.
/// </summary>
public record UploadPetAdImageCommand(IFormFile File) : ICommand<Result<PetAdImageDto>>;
