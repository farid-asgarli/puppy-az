using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Common.Interfaces;

/// <summary>
/// Service for validating file operations.
/// </summary>
public interface IFileValidator
{
	/// <summary>
	/// Validates a file before saving.
	/// </summary>
	/// <param name="stream">The file stream.</param>
	/// <param name="fileName">The file name.</param>
	/// <returns>Validation result with any error messages.</returns>
	ValidationResult ValidateFile(Stream stream, string fileName);

	/// <summary>
	/// Validates a file extension against allowed extensions.
	/// </summary>
	/// <param name="extension">The file extension to validate.</param>
	/// <returns>True if extension is allowed.</returns>
	bool IsExtensionAllowed(string extension);

	/// <summary>
	/// Sanitizes a filename to prevent security issues.
	/// </summary>
	/// <param name="fileName">The filename to sanitize.</param>
	/// <returns>Sanitized filename.</returns>
	string SanitizeFileName(string fileName);

	/// <summary>
	/// Sanitizes a path to prevent directory traversal attacks.
	/// </summary>
	/// <param name="path">The path to sanitize.</param>
	/// <returns>Sanitized path.</returns>
	string SanitizePath(string path);
}
