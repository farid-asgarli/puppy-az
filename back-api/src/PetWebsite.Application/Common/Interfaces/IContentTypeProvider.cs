namespace PetWebsite.Application.Common.Interfaces;

/// <summary>
/// Service for determining content types based on file extensions.
/// </summary>
public interface IContentTypeProvider
{
	/// <summary>
	/// Gets the content type (MIME type) for a given file extension.
	/// </summary>
	/// <param name="extension">The file extension (including the dot).</param>
	/// <returns>The content type/MIME type.</returns>
	string GetContentType(string extension);

	/// <summary>
	/// Tries to get the content type for a given file extension.
	/// </summary>
	/// <param name="extension">The file extension (including the dot).</param>
	/// <param name="contentType">The resulting content type if found.</param>
	/// <returns>True if content type was found.</returns>
	bool TryGetContentType(string extension, out string contentType);
}
