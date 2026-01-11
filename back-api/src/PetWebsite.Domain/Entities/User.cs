using Microsoft.AspNetCore.Identity;

namespace PetWebsite.Domain.Entities;

/// <summary>
/// Represents a regular user (consumer) of the pet website.
/// </summary>
public class User : IdentityUser<Guid>
{
	public string FirstName { get; set; } = string.Empty;
	public string LastName { get; set; } = string.Empty;
	public string? RefreshToken { get; set; }
	public DateTime? RefreshTokenExpiryTime { get; set; }
	public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
	public DateTime? LastLoginAt { get; set; }
	public bool IsActive { get; set; } = true;
	public string? ProfilePictureUrl { get; set; }

	// Navigation properties
	public ICollection<PetAd> PetAds { get; set; } = [];
	public ICollection<FavoriteAd> FavoriteAds { get; set; } = [];
	public ICollection<PetAdImage> UploadedImages { get; set; } = [];

	public string FullName => $"{FirstName} {LastName}";
}
