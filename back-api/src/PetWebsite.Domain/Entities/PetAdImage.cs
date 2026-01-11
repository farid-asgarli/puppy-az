using PetWebsite.Domain.Common;

namespace PetWebsite.Domain.Entities;

/// <summary>
/// Represents an image associated with a pet ad.
/// </summary>
public class PetAdImage : BaseEntity
{
	/// <summary>
	/// Gets or sets the image file path.
	/// </summary>
	public string FilePath { get; set; } = string.Empty;

	/// <summary>
	/// Gets or sets the original file name.
	/// </summary>
	public string FileName { get; set; } = string.Empty;

	/// <summary>
	/// Gets or sets the file size in bytes.
	/// </summary>
	public long FileSize { get; set; }

	/// <summary>
	/// Gets or sets the content type (e.g., "image/jpeg").
	/// </summary>
	public string ContentType { get; set; } = string.Empty;

	/// <summary>
	/// Gets or sets whether this is the primary/main image.
	/// </summary>
	public bool IsPrimary { get; set; }

	/// <summary>
	/// Gets or sets when the image was uploaded.
	/// </summary>
	public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

	/// <summary>
	/// Gets or sets the user ID who uploaded this image.
	/// Used for ownership verification before attaching to pet ad.
	/// </summary>
	public Guid UploadedById { get; set; }

	/// <summary>
	/// Navigation property to the user who uploaded this image.
	/// </summary>
	public User UploadedBy { get; set; } = null!;

	/// <summary>
	/// Gets or sets when the image was attached to a pet ad.
	/// Null for orphaned images not yet attached.
	/// </summary>
	public DateTime? AttachedAt { get; set; }

	/// <summary>
	/// Gets or sets the pet ad ID this image belongs to.
	/// Null for images uploaded but not yet attached to an ad (orphaned state).
	/// </summary>
	public int? PetAdId { get; set; }

	/// <summary>
	/// Navigation property to the pet ad.
	/// Null for orphaned images.
	/// </summary>
	public PetAd? PetAd { get; set; }
}
