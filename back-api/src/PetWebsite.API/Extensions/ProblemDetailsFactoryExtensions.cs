using Microsoft.AspNetCore.Mvc;

namespace PetWebsite.API.Extensions;

/// <summary>
/// Extension methods for creating ProblemDetails instances.
/// </summary>
public static class ProblemDetailsExtensions
{
	/// <summary>
	/// Creates a ProblemDetails instance for validation errors.
	/// </summary>
	public static ProblemDetails CreateValidationProblemDetails(
		HttpContext httpContext,
		string detail,
		Dictionary<string, string[]>? errors = null
	)
	{
		var problemDetails = new ProblemDetails
		{
			Type = "https://tools.ietf.org/html/rfc7231#section-6.5.1",
			Title = "Validation Error",
			Status = StatusCodes.Status400BadRequest,
			Detail = detail,
			Instance = httpContext.Request.Path,
		};

		problemDetails.Extensions["traceId"] = httpContext.TraceIdentifier;
		problemDetails.Extensions["timestamp"] = DateTime.UtcNow;

		if (errors != null && errors.Count > 0)
		{
			problemDetails.Extensions["errors"] = errors;
		}

		return problemDetails;
	}

	/// <summary>
	/// Creates a ProblemDetails instance for unauthorized access.
	/// </summary>
	public static ProblemDetails CreateUnauthorizedProblemDetails(HttpContext httpContext, string? detail = null)
	{
		return new ProblemDetails
		{
			Type = "https://tools.ietf.org/html/rfc7235#section-3.1",
			Title = "Unauthorized",
			Status = StatusCodes.Status401Unauthorized,
			Detail = detail ?? "Authentication is required to access this resource.",
			Instance = httpContext.Request.Path,
			Extensions = { ["traceId"] = httpContext.TraceIdentifier, ["timestamp"] = DateTime.UtcNow },
		};
	}

	/// <summary>
	/// Creates a ProblemDetails instance for forbidden access.
	/// </summary>
	public static ProblemDetails CreateForbiddenProblemDetails(HttpContext httpContext, string? detail = null)
	{
		return new ProblemDetails
		{
			Type = "https://tools.ietf.org/html/rfc7231#section-6.5.3",
			Title = "Forbidden",
			Status = StatusCodes.Status403Forbidden,
			Detail = detail ?? "You do not have permission to access this resource.",
			Instance = httpContext.Request.Path,
			Extensions = { ["traceId"] = httpContext.TraceIdentifier, ["timestamp"] = DateTime.UtcNow },
		};
	}

	/// <summary>
	/// Creates a ProblemDetails instance for not found errors.
	/// </summary>
	public static ProblemDetails CreateNotFoundProblemDetails(HttpContext httpContext, string? detail = null)
	{
		return new ProblemDetails
		{
			Type = "https://tools.ietf.org/html/rfc7231#section-6.5.4",
			Title = "Not Found",
			Status = StatusCodes.Status404NotFound,
			Detail = detail ?? "The requested resource was not found.",
			Instance = httpContext.Request.Path,
			Extensions = { ["traceId"] = httpContext.TraceIdentifier, ["timestamp"] = DateTime.UtcNow },
		};
	}

	/// <summary>
	/// Creates a ProblemDetails instance for conflict errors.
	/// </summary>
	public static ProblemDetails CreateConflictProblemDetails(HttpContext httpContext, string? detail = null)
	{
		return new ProblemDetails
		{
			Type = "https://tools.ietf.org/html/rfc7231#section-6.5.8",
			Title = "Conflict",
			Status = StatusCodes.Status409Conflict,
			Detail = detail ?? "The request conflicts with the current state of the resource.",
			Instance = httpContext.Request.Path,
			Extensions = { ["traceId"] = httpContext.TraceIdentifier, ["timestamp"] = DateTime.UtcNow },
		};
	}
}
