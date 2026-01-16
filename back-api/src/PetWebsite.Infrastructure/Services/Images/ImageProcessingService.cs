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

			// Encode the image
			using var image = SKImage.FromBitmap(bitmapToEncode);
			var outputStream = new MemoryStream();

			SKData? encodedData;
			if (outputFormat == SKEncodedImageFormat.Webp)
			{
				encodedData = image.Encode(SKEncodedImageFormat.Webp, quality);
			}
			else if (outputFormat == SKEncodedImageFormat.Jpeg)
			{
				encodedData = image.Encode(SKEncodedImageFormat.Jpeg, quality);
			}
			else
			{
				// PNG - no quality parameter
				encodedData = image.Encode(SKEncodedImageFormat.Png, 100);
			}

			if (encodedData == null)
			{
				_logger.LogWarning("Failed to encode image {FileName}", fileName);
				imageStream.Position = 0;
				return CreateUnprocessedResult(imageStream, fileName, originalSize, extension);
			}

			await encodedData.AsStream().CopyToAsync(outputStream, cancellationToken);
			encodedData.Dispose();

			outputStream.Position = 0;
			var processedSize = outputStream.Length;

			// If processed is larger than original, return original
			if (processedSize >= originalSize)
			{
				_logger.LogDebug(
					"Processed image {FileName} is larger ({ProcessedSize}) than original ({OriginalSize}), keeping original",
					fileName,
					processedSize,
					originalSize
				);
				outputStream.Dispose();
				imageStream.Position = 0;
				return CreateUnprocessedResult(imageStream, fileName, originalSize, extension);
			}

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
			return (SKEncodedImageFormat.Webp, ".webp", _options.WebPQuality);
		}

		// PNG: check for transparency
		if (originalExtension == ".png")
		{
			bool hasTransparency = HasTransparency(bitmap);
			if (hasTransparency)
			{
				// Keep as PNG to preserve transparency
				return (SKEncodedImageFormat.Png, ".png", 100);
			}
			else if (_options.ConvertPngToJpeg)
			{
				// Convert to JPEG for better compression
				return (SKEncodedImageFormat.Jpeg, ".jpg", _options.JpegQuality);
			}
			else
			{
				return (SKEncodedImageFormat.Png, ".png", 100);
			}
		}

		// JPEG stays as JPEG
		return (SKEncodedImageFormat.Jpeg, ".jpg", _options.JpegQuality);
	}

	private static bool HasTransparency(SKBitmap bitmap)
	{
		// Check if the bitmap has an alpha channel and if any pixel uses it
		if (bitmap.AlphaType == SKAlphaType.Opaque)
		{
			return false;
		}

		// Sample a subset of pixels for performance
		var sampleRate = Math.Max(1, Math.Max(bitmap.Width, bitmap.Height) / 100);
		for (int y = 0; y < bitmap.Height; y += sampleRate)
		{
			for (int x = 0; x < bitmap.Width; x += sampleRate)
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
