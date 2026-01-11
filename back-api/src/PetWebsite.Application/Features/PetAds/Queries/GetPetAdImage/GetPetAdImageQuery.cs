using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.PetAds.Queries.GetPetAdImage;

/// <summary>
/// Query to get a pet ad image by ID.
/// Returns the image metadata and file path for serving.
/// </summary>
public record GetPetAdImageQuery(int ImageId) : IQuery<Result<PetAdImageDto>>;
