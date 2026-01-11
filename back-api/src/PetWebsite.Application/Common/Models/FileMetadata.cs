namespace PetWebsite.Application.Common.Models;

/// <summary>
/// Represents metadata information about a file.
/// </summary>
public class FileMetadata
{
    public string FileName { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public long Size { get; set; }
    public string Extension { get; set; } = string.Empty;
    public string RelativePath { get; set; } = string.Empty;
    public string Checksum { get; set; } = string.Empty;
    public string ChecksumAlgorithm { get; set; } = "SHA256";
    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
}
