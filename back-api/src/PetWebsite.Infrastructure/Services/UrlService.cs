using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using PetWebsite.Application.Common.Interfaces;

namespace PetWebsite.Infrastructure.Services;

/// <summary>
/// Service for generating absolute URLs from relative paths.
/// </summary>
public class UrlService(IHttpContextAccessor httpContextAccessor, IConfiguration configuration) : IUrlService
{
	private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;
	private readonly string? _configuredBaseUrl = configuration["App:BaseUrl"]?.TrimEnd('/');

	// Bump this when stored asset bytes change without the path changing
	// (e.g. re-watermarking existing uploads) to bust CDN/browser image caches.
	private const string AssetVersion = "2";

	private static string AppendVersion(string url)
	{
		var separator = url.Contains('?') ? "&" : "?";
		return $"{url}{separator}v={AssetVersion}";
	}

	public string ToAbsoluteUrl(string? relativePath)
	{
		if (string.IsNullOrWhiteSpace(relativePath))
			return string.Empty;

		// If it's already an absolute URL, return as is
		if (
			relativePath.StartsWith("http://", StringComparison.OrdinalIgnoreCase)
			|| relativePath.StartsWith("https://", StringComparison.OrdinalIgnoreCase)
		)
		{
			return relativePath;
		}

		// Ensure the relative path starts with a forward slash
		var path = relativePath.StartsWith('/') ? relativePath : $"/{relativePath}";

		// URL-encode each segment of the path to handle spaces, commas, etc.
		path = EncodePathSegments(path);

		// Priority 1: Use explicitly configured base URL (most reliable for production)
		if (!string.IsNullOrEmpty(_configuredBaseUrl))
		{
			return AppendVersion($"{_configuredBaseUrl}{path}");
		}

		// Priority 2: Try to build from HTTP context with forwarded headers support
		var httpContext = _httpContextAccessor.HttpContext;
		if (httpContext == null)
			return AppendVersion(path); // Fallback to relative path if no context

		var request = httpContext.Request;

		// Check for X-Forwarded headers (set by reverse proxies like nginx)
		var forwardedHost = request.Headers["X-Forwarded-Host"].FirstOrDefault();
		var forwardedProto = request.Headers["X-Forwarded-Proto"].FirstOrDefault();

		var host = !string.IsNullOrEmpty(forwardedHost) ? forwardedHost : request.Host.Value;
		var scheme = !string.IsNullOrEmpty(forwardedProto) ? forwardedProto : request.Scheme;

		return AppendVersion($"{scheme}://{host}{path}");
	}

	/// <summary>
	/// Encode each segment of the path individually, preserving '/' separators.
	/// Handles filenames with spaces, commas, and other special characters.
	/// </summary>
	private static string EncodePathSegments(string path)
	{
		var segments = path.Split('/');
		for (var i = 0; i < segments.Length; i++)
		{
			if (!string.IsNullOrEmpty(segments[i]))
			{
				segments[i] = Uri.EscapeDataString(segments[i]);
			}
		}
		return string.Join("/", segments);
	}

	public IEnumerable<string> ToAbsoluteUrls(IEnumerable<string?> relativePaths)
	{
		return relativePaths.Select(ToAbsoluteUrl);
	}
}
