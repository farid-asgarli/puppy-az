namespace PetWebsite.Application.Common.Interfaces;

/// <summary>
/// Service for processing and compressing images.
/// </summary>
public interface IImageProcessingService
{
	/// <summary>
	/// Processes an image by compressing and/or resizing it if needed.
	/// Images smaller than the configured threshold will be returned as-is.
	/// </summary>
	/// <param name="imageStream">The input image stream.</param>
	/// <param name="fileName">The original file name (used to determine format).</param>
	/// <param name="cancellationToken">Cancellation token.</param>
	/// <returns>A result containing the processed image stream and metadata.</returns>
	Task<ImageProcessingResult> ProcessImageAsync(Stream imageStream, string fileName, CancellationToken cancellationToken = default);

	/// <summary>
	/// Checks if a file is a supported image format.
	/// </summary>
	/// <param name="fileName">The file name to check.</param>
	/// <returns>True if the file is a supported image format.</returns>
	bool IsSupportedImageFormat(string fileName);
}

/// <summary>
/// Result of image processing operation.
/// </summary>
public class ImageProcessingResult
{
	/// <summary>
	/// The processed image stream. Caller is responsible for disposing.
	/// </summary>
	public required Stream ProcessedStream { get; init; }

	/// <summary>
	/// The original file size in bytes.
	/// </summary>
	public long OriginalSize { get; init; }

	/// <summary>
	/// The processed file size in bytes.
	/// </summary>
	public long ProcessedSize { get; init; }

	/// <summary>
	/// Whether the image was actually compressed/resized.
	/// </summary>
	public bool WasProcessed { get; init; }

	/// <summary>
	/// The output file extension (e.g., ".jpg", ".webp").
	/// </summary>
	public required string OutputExtension { get; init; }

	/// <summary>
	/// The suggested new file name after processing.
	/// </summary>
	public required string ProcessedFileName { get; init; }

	/// <summary>
	/// Original image width in pixels (0 if not processed).
	/// </summary>
	public int OriginalWidth { get; init; }

	/// <summary>
	/// Original image height in pixels (0 if not processed).
	/// </summary>
	public int OriginalHeight { get; init; }

	/// <summary>
	/// Processed image width in pixels (0 if not processed).
	/// </summary>
	public int ProcessedWidth { get; init; }

	/// <summary>
	/// Processed image height in pixels (0 if not processed).
	/// </summary>
	public int ProcessedHeight { get; init; }
}
