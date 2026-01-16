namespace PetWebsite.Infrastructure.Configuration;

/// <summary>
/// Configuration options for image processing.
/// </summary>
public class ImageProcessingOptions
{
	public const string SectionName = "ImageProcessing";

	/// <summary>
	/// Whether image processing is enabled.
	/// </summary>
	public bool Enabled { get; set; } = true;

	/// <summary>
	/// Minimum file size in bytes before compression is applied.
	/// Images smaller than this won't be compressed.
	/// Default: 500KB
	/// </summary>
	public long CompressionThreshold { get; set; } = 500 * 1024;

	/// <summary>
	/// Maximum width for images. Images wider than this will be resized.
	/// Default: 1920 pixels
	/// </summary>
	public int MaxWidth { get; set; } = 1920;

	/// <summary>
	/// Maximum height for images. Images taller than this will be resized.
	/// Default: 1920 pixels
	/// </summary>
	public int MaxHeight { get; set; } = 1920;

	/// <summary>
	/// JPEG quality for compression (1-100).
	/// Default: 85
	/// </summary>
	public int JpegQuality { get; set; } = 85;

	/// <summary>
	/// WebP quality for compression (1-100).
	/// Default: 85
	/// </summary>
	public int WebPQuality { get; set; } = 85;

	/// <summary>
	/// Whether to convert PNG images to JPEG for better compression.
	/// PNG images with transparency will keep their format.
	/// Default: true
	/// </summary>
	public bool ConvertPngToJpeg { get; set; } = true;

	/// <summary>
	/// Whether to preserve image metadata (EXIF data).
	/// Default: false (strip metadata for smaller files and privacy)
	/// </summary>
	public bool PreserveMetadata { get; set; } = false;
}
