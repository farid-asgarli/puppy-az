using Microsoft.AspNetCore.Mvc;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.API.Extensions;

public static class ResultExtensions
{
	/// <summary>
	/// Converts a Result to an IActionResult with appropriate status codes using ProblemDetails for errors.
	/// </summary>
	public static IActionResult ToActionResult<T>(this Result<T> result)
	{
		if (result.IsSuccess)
		{
			return new ObjectResult(result.Data) { StatusCode = result.StatusCode };
		}

		return ToProblemDetails(result.Error, result.Errors, result.StatusCode);
	}

	/// <summary>
	/// Converts a Result without data to an IActionResult with appropriate status codes using ProblemDetails for errors.
	/// </summary>
	public static IActionResult ToActionResult(this Result result)
	{
		if (result.IsSuccess)
		{
			return new StatusCodeResult(result.StatusCode);
		}

		return ToProblemDetails(result.Error, result.Errors, result.StatusCode);
	}

	private static IActionResult ToProblemDetails(string? error, IEnumerable<string>? errors, int statusCode)
	{
		var problemDetails = new ProblemDetails
		{
			Status = statusCode,
			Title = GetTitle(statusCode),
			Detail = error,
			Type = GetTypeUri(statusCode),
		};

		// Add multiple errors as extensions if present
		if (errors != null && errors.Any())
		{
			problemDetails.Extensions["errors"] = errors;
		}

		return new ObjectResult(problemDetails) { StatusCode = statusCode };
	}

	private static string GetTitle(int statusCode) =>
		statusCode switch
		{
			400 => "Bad Request",
			401 => "Unauthorized",
			403 => "Forbidden",
			404 => "Not Found",
			409 => "Conflict",
			422 => "Unprocessable Entity",
			500 => "Internal Server Error",
			_ => "Error",
		};

	private static string GetTypeUri(int statusCode) =>
		statusCode switch
		{
			400 => "https://tools.ietf.org/html/rfc7231#section-6.5.1",
			401 => "https://tools.ietf.org/html/rfc7235#section-3.1",
			403 => "https://tools.ietf.org/html/rfc7231#section-6.5.3",
			404 => "https://tools.ietf.org/html/rfc7231#section-6.5.4",
			409 => "https://tools.ietf.org/html/rfc7231#section-6.5.8",
			422 => "https://tools.ietf.org/html/rfc4918#section-11.2",
			500 => "https://tools.ietf.org/html/rfc7231#section-6.6.1",
			_ => "https://tools.ietf.org/html/rfc7231",
		};
}
