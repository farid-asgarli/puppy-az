namespace PetWebsite.Application.Features.PetAds;

/// <summary>
/// DTO for pet ad image metadata.
/// </summary>
public class PetAdImageDto
{
	public int Id { get; set; }
	public string FilePath { get; set; } = string.Empty;
	public string FileName { get; set; } = string.Empty;
	public long FileSize { get; set; }
	public string ContentType { get; set; } = string.Empty;
	public bool IsPrimary { get; set; }
	public DateTime UploadedAt { get; set; }
	public string Url { get; set; } = string.Empty; // URL to view/download the image
}
