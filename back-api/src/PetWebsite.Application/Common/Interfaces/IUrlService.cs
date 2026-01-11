namespace PetWebsite.Application.Common.Interfaces;

/// <summary>
/// Service for generating absolute URLs from relative paths.
/// </summary>
public interface IUrlService
{
	/// <summary>
	/// Converts a relative file path to an absolute URL with the server origin.
	/// </summary>
	/// <param name="relativePath">The relative path (e.g., "uploads/images/file.jpg")</param>
	/// <returns>The absolute URL (e.g., "https://example.com/uploads/images/file.jpg")</returns>
	string ToAbsoluteUrl(string? relativePath);

	/// <summary>
	/// Converts multiple relative file paths to absolute URLs.
	/// </summary>
	/// <param name="relativePaths">Collection of relative paths</param>
	/// <returns>Collection of absolute URLs</returns>
	IEnumerable<string> ToAbsoluteUrls(IEnumerable<string?> relativePaths);
}
