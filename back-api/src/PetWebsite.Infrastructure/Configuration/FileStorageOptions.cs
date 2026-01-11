namespace PetWebsite.Infrastructure.Configuration;

/// <summary>
/// Configuration options for file storage.
/// </summary>
public class FileStorageOptions
{
    public const string SectionName = "FileStorage";

    /// <summary>
    /// Root directory for file storage. Relative to application directory.
    /// </summary>
    public string RootPath { get; set; } = "uploads";

    /// <summary>
    /// Maximum file size in bytes. Default is 10 MB.
    /// </summary>
    public long MaxFileSize { get; set; } = 10 * 1024 * 1024;

    /// <summary>
    /// Allowed file extensions.
    /// </summary>
    public string[] AllowedExtensions { get; set; } =
        [".jpg", ".jpeg", ".png", ".gif", ".pdf", ".doc", ".docx", ".txt", ".zip"];

    /// <summary>
    /// Hash algorithm to use for checksums (MD5, SHA256, SHA512).
    /// </summary>
    public string ChecksumAlgorithm { get; set; } = "SHA256";
}
