using Microsoft.AspNetCore.Http;
using PetWebsite.Application.Common.Interfaces;

namespace PetWebsite.Infrastructure.Services;

/// <summary>
/// Service for generating absolute URLs from relative paths.
/// </summary>
public class UrlService : IUrlService
{
	private readonly IHttpContextAccessor _httpContextAccessor;

	public UrlService(IHttpContextAccessor httpContextAccessor)
	{
		_httpContextAccessor = httpContextAccessor;
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

		var httpContext = _httpContextAccessor.HttpContext;
		if (httpContext == null)
			return relativePath; // Fallback to relative path if no context

		var request = httpContext.Request;
		var scheme = request.Scheme;
		var host = request.Host.Value;

		// Ensure the relative path starts with a forward slash
		var path = relativePath.StartsWith('/') ? relativePath : $"/{relativePath}";

		return $"{scheme}://{host}{path}";
	}

	public IEnumerable<string> ToAbsoluteUrls(IEnumerable<string?> relativePaths)
	{
		return relativePaths.Select(ToAbsoluteUrl);
	}
}
