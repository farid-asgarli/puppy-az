using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Infrastructure.Configuration;
using SkiaSharp;

namespace PetWebsite.Infrastructure.Services.Images;

/// <summary>
/// Service for processing and compressing images using SkiaSharp.
/// </summary>
public class ImageProcessingService(IOptions<ImageProcessingOptions> options, ILogger<ImageProcessingService> logger)
	: IImageProcessingService
{
	private readonly ImageProcessingOptions _options = options.Value;
	private readonly ILogger<ImageProcessingService> _logger = logger;
	private static readonly HashSet<string> SupportedExtensions = new(StringComparer.OrdinalIgnoreCase)
	{
		".jpg",
		".jpeg",
		".png",
		".webp",
	};

	public bool IsSupportedImageFormat(string fileName)
	{
		var extension = Path.GetExtension(fileName);
		return SupportedExtensions.Contains(extension);
	}

	public async Task<ImageProcessingResult> ProcessImageAsync(
		Stream imageStream,
		string fileName,
		CancellationToken cancellationToken = default
	)
	{
		ArgumentNullException.ThrowIfNull(imageStream);
		ArgumentNullException.ThrowIfNull(fileName);

		var originalSize = imageStream.Length;
		var extension = Path.GetExtension(fileName).ToLowerInvariant();

		// If processing is disabled or not a supported format, return original
		if (!_options.Enabled || !IsSupportedImageFormat(fileName))
		{
			imageStream.Position = 0;
			return CreateUnprocessedResult(imageStream, fileName, originalSize, extension);
		}

		// If file is below threshold, don't process
		if (originalSize <= _options.CompressionThreshold)
		{
			_logger.LogDebug(
				"Image {FileName} ({Size} bytes) is below compression threshold ({Threshold} bytes), skipping processing",
				fileName,
				originalSize,
				_options.CompressionThreshold
			);
			imageStream.Position = 0;
			return CreateUnprocessedResult(imageStream, fileName, originalSize, extension);
		}

		try
		{
			imageStream.Position = 0;
			return await ProcessImageInternalAsync(imageStream, fileName, originalSize, cancellationToken);
		}
		catch (Exception ex)
		{
			_logger.LogWarning(ex, "Failed to process image {FileName}, returning original", fileName);
			imageStream.Position = 0;
			return CreateUnprocessedResult(imageStream, fileName, originalSize, extension);
		}
	}

	private async Task<ImageProcessingResult> ProcessImageInternalAsync(
		Stream imageStream,
		string fileName,
		long originalSize,
		CancellationToken cancellationToken
	)
	{
		// Load the image
		using var original = SKBitmap.Decode(imageStream);
		if (original == null)
		{
			_logger.LogWarning("Failed to decode image {FileName}", fileName);
			imageStream.Position = 0;
			var ext = Path.GetExtension(fileName).ToLowerInvariant();
			return CreateUnprocessedResult(imageStream, fileName, originalSize, ext);
		}

		var originalWidth = original.Width;
		var originalHeight = original.Height;
		var extension = Path.GetExtension(fileName).ToLowerInvariant();

		// Determine if we need to resize
		bool needsResize = originalWidth > _options.MaxWidth || originalHeight > _options.MaxHeight;

		// Calculate new dimensions maintaining aspect ratio
		int newWidth = originalWidth;
		int newHeight = originalHeight;

		if (needsResize)
		{
			var widthRatio = (double)_options.MaxWidth / originalWidth;
			var heightRatio = (double)_options.MaxHeight / originalHeight;
			var ratio = Math.Min(widthRatio, heightRatio);

			newWidth = (int)(originalWidth * ratio);
			newHeight = (int)(originalHeight * ratio);
		}

		// Determine output format
		var (outputFormat, outputExtension, quality) = DetermineOutputFormat(original, extension);

		// Process the image
		SKBitmap? resized = null;
		try
		{
			var bitmapToEncode = original;

			if (needsResize)
			{
				resized = original.Resize(
					new SKImageInfo(newWidth, newHeight),
					new SKSamplingOptions(SKFilterMode.Linear, SKMipmapMode.Linear)
				);
				if (resized != null)
				{
					bitmapToEncode = resized;
				}
				else
				{
					_logger.LogWarning("Failed to resize image {FileName}, using original dimensions", fileName);
					newWidth = originalWidth;
					newHeight = originalHeight;
				}
			}

			// Encode the image - try progressively lower quality if needed
			using var image = SKImage.FromBitmap(bitmapToEncode);

			// For large files (> 1MB), be more aggressive with compression
			var qualityLevels = originalSize > 1024 * 1024 ? new[] { quality, 75, 65, 55 } : new[] { quality, 75 };

			MemoryStream? bestOutputStream = null;
			long bestSize = long.MaxValue;
			int usedQuality = quality;

			foreach (var q in qualityLevels)
			{
				SKData? encodedData;
				if (outputFormat == SKEncodedImageFormat.Webp)
				{
					encodedData = image.Encode(SKEncodedImageFormat.Webp, q);
				}
				else if (outputFormat == SKEncodedImageFormat.Jpeg)
				{
					encodedData = image.Encode(SKEncodedImageFormat.Jpeg, q);
				}
				else
				{
					// PNG - no quality parameter, only try once
					encodedData = image.Encode(SKEncodedImageFormat.Png, 100);
				}

				if (encodedData == null)
				{
					continue;
				}

				var tempStream = new MemoryStream();
				await encodedData.AsStream().CopyToAsync(tempStream, cancellationToken);
				encodedData.Dispose();

				var currentSize = tempStream.Length;

				// If this quality produces a smaller file than original and is the best so far
				if (currentSize < originalSize && currentSize < bestSize)
				{
					bestOutputStream?.Dispose();
					bestOutputStream = tempStream;
					bestSize = currentSize;
					usedQuality = q;

					// If we achieved good compression (< 50% of original), stop trying
					if (currentSize < originalSize * 0.5)
					{
						break;
					}
				}
				else
				{
					tempStream.Dispose();
				}

				// PNG doesn't have quality levels, so break after first attempt
				if (outputFormat == SKEncodedImageFormat.Png)
				{
					break;
				}
			}

			if (bestOutputStream == null)
			{
				_logger.LogDebug("Could not compress image {FileName} to smaller size at any quality level, keeping original", fileName);
				imageStream.Position = 0;
				return CreateUnprocessedResult(imageStream, fileName, originalSize, extension);
			}

			var outputStream = bestOutputStream;
			outputStream.Position = 0;
			var processedSize = outputStream.Length;

			_logger.LogDebug(
				"Best compression for {FileName}: quality {Quality} achieved {Size} bytes",
				fileName,
				usedQuality,
				processedSize
			);

			// Generate new filename with new extension
			var processedFileName = Path.ChangeExtension(fileName, outputExtension);

			_logger.LogInformation(
				"Image {FileName} processed: {OriginalSize} -> {ProcessedSize} bytes ({Reduction:P1} reduction), {OriginalWidth}x{OriginalHeight} -> {NewWidth}x{NewHeight}",
				fileName,
				originalSize,
				processedSize,
				1 - (double)processedSize / originalSize,
				originalWidth,
				originalHeight,
				newWidth,
				newHeight
			);

			return new ImageProcessingResult
			{
				ProcessedStream = outputStream,
				OriginalSize = originalSize,
				ProcessedSize = processedSize,
				WasProcessed = true,
				OutputExtension = outputExtension,
				ProcessedFileName = processedFileName,
				OriginalWidth = originalWidth,
				OriginalHeight = originalHeight,
				ProcessedWidth = newWidth,
				ProcessedHeight = newHeight,
			};
		}
		finally
		{
			resized?.Dispose();
		}
	}

	private (SKEncodedImageFormat format, string extension, int quality) DetermineOutputFormat(SKBitmap bitmap, string originalExtension)
	{
		// WebP stays as WebP
		if (originalExtension == ".webp")
		{
			_logger.LogDebug("Image is WebP, keeping as WebP with quality {Quality}", _options.WebPQuality);
			return (SKEncodedImageFormat.Webp, ".webp", _options.WebPQuality);
		}

		// PNG: check for transparency
		if (originalExtension == ".png")
		{
			bool hasTransparency = HasTransparency(bitmap);
			_logger.LogDebug(
				"PNG image transparency check: HasTransparency={HasTransparency}, AlphaType={AlphaType}, ColorType={ColorType}",
				hasTransparency,
				bitmap.AlphaType,
				bitmap.ColorType
			);

			if (hasTransparency)
			{
				// Keep as PNG to preserve transparency
				_logger.LogDebug("PNG has transparency, keeping as PNG");
				return (SKEncodedImageFormat.Png, ".png", 100);
			}
			else if (_options.ConvertPngToJpeg)
			{
				// Convert to JPEG for better compression
				_logger.LogDebug("PNG is opaque, converting to JPEG with quality {Quality}", _options.JpegQuality);
				return (SKEncodedImageFormat.Jpeg, ".jpg", _options.JpegQuality);
			}
			else
			{
				_logger.LogDebug("PNG is opaque but ConvertPngToJpeg is disabled, keeping as PNG");
				return (SKEncodedImageFormat.Png, ".png", 100);
			}
		}

		// JPEG stays as JPEG
		_logger.LogDebug("Image is JPEG, keeping as JPEG with quality {Quality}", _options.JpegQuality);
		return (SKEncodedImageFormat.Jpeg, ".jpg", _options.JpegQuality);
	}

	private static bool HasTransparency(SKBitmap bitmap)
	{
		// Quick check: if the color type doesn't support alpha, it's definitely opaque
		if (bitmap.ColorType == SKColorType.Rgb565 || bitmap.ColorType == SKColorType.Rgb888x)
		{
			return false;
		}

		// Check if the bitmap's alpha type is explicitly opaque
		if (bitmap.AlphaType == SKAlphaType.Opaque)
		{
			return false;
		}

		// For images with alpha channel, we need to actually check pixels
		// Sample pixels across the image to check for actual transparency
		var width = bitmap.Width;
		var height = bitmap.Height;

		// Use a reasonable sample size - check at most 10000 pixels spread across the image
		var totalPixels = width * height;
		var sampleCount = Math.Min(10000, totalPixels);
		var step = Math.Max(1, (int)Math.Sqrt((double)totalPixels / sampleCount));

		for (int y = 0; y < height; y += step)
		{
			for (int x = 0; x < width; x += step)
			{
				var pixel = bitmap.GetPixel(x, y);
				if (pixel.Alpha < 255)
				{
					return true;
				}
			}
		}

		return false;
	}

	private static ImageProcessingResult CreateUnprocessedResult(Stream stream, string fileName, long size, string extension)
	{
		// Create a copy of the stream to return
		var outputStream = new MemoryStream();
		stream.CopyTo(outputStream);
		outputStream.Position = 0;

		return new ImageProcessingResult
		{
			ProcessedStream = outputStream,
			OriginalSize = size,
			ProcessedSize = size,
			WasProcessed = false,
			OutputExtension = extension,
			ProcessedFileName = fileName,
			OriginalWidth = 0,
			OriginalHeight = 0,
			ProcessedWidth = 0,
			ProcessedHeight = 0,
		};
	}
}
