using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using PetWebsite.Application.Common.Interfaces;

namespace PetWebsite.Infrastructure.Services.Identity;

/// <summary>
/// Implementation of ICurrentUserService that retrieves current user context from HttpContext.
/// </summary>
public class CurrentUserService(IHttpContextAccessor httpContextAccessor) : ICurrentUserService
{
	private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;

	public Guid? UserId
	{
		get
		{
			var userIdClaim = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);
			return Guid.TryParse(userIdClaim, out var userId) ? userId : null;
		}
	}

	public string? UserEmail => _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.Email);

	public IEnumerable<string> Roles => _httpContextAccessor.HttpContext?.User?.FindAll(ClaimTypes.Role).Select(c => c.Value) ?? [];

	public string CurrentCulture
	{
		get
		{
			var acceptLanguage = _httpContextAccessor.HttpContext?.Request.Headers["Accept-Language"].ToString();
			var culture = acceptLanguage?.Split(',').FirstOrDefault()?.Trim();
			return string.IsNullOrWhiteSpace(culture) ? "en" : culture;
		}
	}

	public bool IsAuthenticated => _httpContextAccessor.HttpContext?.User?.Identity?.IsAuthenticated ?? false;

	public bool IsInRole(string role)
	{
		return _httpContextAccessor.HttpContext?.User?.IsInRole(role) ?? false;
	}

	public bool IsInAnyRole(params string[] roles)
	{
		if (roles == null || roles.Length == 0)
			return false;

		return roles.Any(IsInRole);
	}

	public bool IsInAllRoles(params string[] roles)
	{
		if (roles == null || roles.Length == 0)
			return false;

		return roles.All(IsInRole);
	}

	public string? GetTokenId()
	{
		return _httpContextAccessor.HttpContext?.User?.FindFirstValue("jti");
	}

	public DateTime? GetTokenExpiration()
	{
		var expClaim = _httpContextAccessor.HttpContext?.User?.FindFirstValue("exp");
		if (expClaim != null && long.TryParse(expClaim, out var exp))
		{
			return DateTimeOffset.FromUnixTimeSeconds(exp).UtcDateTime;
		}

		return null;
	}
}
