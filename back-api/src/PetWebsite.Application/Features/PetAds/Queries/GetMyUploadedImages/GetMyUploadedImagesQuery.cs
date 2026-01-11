using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.PetAds.Queries.GetMyUploadedImages;

/// <summary>
/// Query to get the current user's uploaded pet ad images.
/// Only returns images that are not yet attached to an ad (orphaned state).
/// </summary>
public record GetMyUploadedImagesQuery : IQuery<Result<List<PetAdImageDto>>>;
