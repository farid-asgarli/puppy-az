using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Common.Interfaces;

/// <summary>
/// Service for managing file operations on the server.
/// </summary>
public interface IFileService
{
	/// <summary>
	/// Saves a file to the server storage.
	/// </summary>
	/// <param name="stream">The file stream to save.</param>
	/// <param name="fileName">The name of the file.</param>
	/// <param name="subfolder">Optional subfolder path.</param>
	/// <param name="cancellationToken">Cancellation token.</param>
	/// <returns>File metadata.</returns>
	/// <exception cref="FileException">Thrown when file save operation fails.</exception>
	Task<FileMetadata> SaveFileAsync(
		Stream stream,
		string fileName,
		string? subfolder = null,
		CancellationToken cancellationToken = default
	);

	/// <summary>
	/// Reads a file from the server storage.
	/// </summary>
	/// <param name="relativePath">The relative path to the file.</param>
	/// <param name="cancellationToken">Cancellation token.</param>
	/// <returns>The file stream.</returns>
	/// <exception cref="FileException">Thrown when file retrieval fails.</exception>
	Task<Stream> GetFileAsync(string relativePath, CancellationToken cancellationToken = default);

	/// <summary>
	/// Deletes a file from the server storage.
	/// </summary>
	/// <param name="relativePath">The relative path to the file.</param>
	/// <param name="cancellationToken">Cancellation token.</param>
	/// <exception cref="FileException">Thrown when file deletion fails.</exception>
	Task DeleteFileAsync(string relativePath, CancellationToken cancellationToken = default);

	/// <summary>
	/// Checks if a file exists in the server storage.
	/// </summary>
	/// <param name="relativePath">The relative path to the file.</param>
	/// <returns>True if the file exists; otherwise, false.</returns>
	bool FileExists(string relativePath);

	/// <summary>
	/// Calculates the checksum of a file.
	/// </summary>
	/// <param name="stream">The file stream.</param>
	/// <param name="algorithm">The hash algorithm to use (MD5, SHA256, SHA512).</param>
	/// <param name="cancellationToken">Cancellation token.</param>
	/// <returns>The checksum as a hexadecimal string.</returns>
	/// <exception cref="FileException">Thrown when checksum calculation fails.</exception>
	Task<string> CalculateChecksumAsync(Stream stream, string algorithm = "SHA256", CancellationToken cancellationToken = default);

	/// <summary>
	/// Verifies the integrity of a file using its checksum.
	/// </summary>
	/// <param name="relativePath">The relative path to the file.</param>
	/// <param name="expectedChecksum">The expected checksum value.</param>
	/// <param name="algorithm">The hash algorithm to use.</param>
	/// <param name="cancellationToken">Cancellation token.</param>
	/// <returns>True if the checksum matches; otherwise, false.</returns>
	/// <exception cref="FileException">Thrown when verification fails.</exception>
	Task<bool> VerifyFileIntegrityAsync(
		string relativePath,
		string expectedChecksum,
		string algorithm = "SHA256",
		CancellationToken cancellationToken = default
	);

	/// <summary>
	/// Gets the metadata for a file.
	/// </summary>
	/// <param name="relativePath">The relative path to the file.</param>
	/// <param name="cancellationToken">Cancellation token.</param>
	/// <returns>File metadata.</returns>
	/// <exception cref="FileException">Thrown when metadata retrieval fails.</exception>
	Task<FileMetadata> GetFileMetadataAsync(string relativePath, CancellationToken cancellationToken = default);

	/// <summary>
	/// Gets the full physical path for a relative path.
	/// </summary>
	/// <param name="relativePath">The relative path.</param>
	/// <returns>The full physical path.</returns>
	/// <exception cref="FileException">Thrown when path resolution fails.</exception>
	string GetPhysicalPath(string relativePath);
}
