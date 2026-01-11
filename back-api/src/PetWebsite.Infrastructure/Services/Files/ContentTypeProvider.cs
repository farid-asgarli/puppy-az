using PetWebsite.Application.Common.Interfaces;

namespace PetWebsite.Infrastructure.Services.Files;

/// <summary>
/// Default implementation of content type provider.
/// Maps file extensions to MIME types.
/// </summary>
public class ContentTypeProvider : IContentTypeProvider
{
	private static readonly Dictionary<string, string> ContentTypeMappings = new(StringComparer.OrdinalIgnoreCase)
	{
		// Images
		[".jpg"] = "image/jpeg",
		[".jpeg"] = "image/jpeg",
		[".png"] = "image/png",
		[".gif"] = "image/gif",
		[".bmp"] = "image/bmp",
		[".webp"] = "image/webp",
		[".svg"] = "image/svg+xml",
		[".ico"] = "image/x-icon",

		// Documents
		[".pdf"] = "application/pdf",
		[".doc"] = "application/msword",
		[".docx"] = "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		[".xls"] = "application/vnd.ms-excel",
		[".xlsx"] = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		[".ppt"] = "application/vnd.ms-powerpoint",
		[".pptx"] = "application/vnd.openxmlformats-officedocument.presentationml.presentation",

		// Text
		[".txt"] = "text/plain",
		[".csv"] = "text/csv",
		[".html"] = "text/html",
		[".htm"] = "text/html",
		[".css"] = "text/css",
		[".js"] = "application/javascript",
		[".json"] = "application/json",
		[".xml"] = "application/xml",

		// Archives
		[".zip"] = "application/zip",
		[".rar"] = "application/x-rar-compressed",
		[".7z"] = "application/x-7z-compressed",
		[".tar"] = "application/x-tar",
		[".gz"] = "application/gzip",

		// Audio
		[".mp3"] = "audio/mpeg",
		[".wav"] = "audio/wav",
		[".ogg"] = "audio/ogg",

		// Video
		[".mp4"] = "video/mp4",
		[".avi"] = "video/x-msvideo",
		[".mov"] = "video/quicktime",
		[".wmv"] = "video/x-ms-wmv",
	};

	private const string DefaultContentType = "application/octet-stream";

	public string GetContentType(string extension)
	{
		if (string.IsNullOrWhiteSpace(extension))
		{
			return DefaultContentType;
		}

		var normalizedExtension = extension.ToLowerInvariant();
		if (!normalizedExtension.StartsWith('.'))
		{
			normalizedExtension = "." + normalizedExtension;
		}

		return ContentTypeMappings.GetValueOrDefault(normalizedExtension, DefaultContentType);
	}

	public bool TryGetContentType(string extension, out string contentType)
	{
		if (string.IsNullOrWhiteSpace(extension))
		{
			contentType = DefaultContentType;
			return false;
		}

		var normalizedExtension = extension.ToLowerInvariant();
		if (!normalizedExtension.StartsWith('.'))
		{
			normalizedExtension = "." + normalizedExtension;
		}

		if (ContentTypeMappings.TryGetValue(normalizedExtension, out var mappedType))
		{
			contentType = mappedType;
			return true;
		}

		contentType = DefaultContentType;
		return false;
	}
}
