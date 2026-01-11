using System.Net;
using System.Net.Mime;
using System.Text.Json;
using FluentValidation;
using Microsoft.Extensions.Localization;

namespace PetWebsite.API.Middleware;

public class ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger, IWebHostEnvironment environment)
{
	private readonly RequestDelegate _next = next;
	private readonly ILogger<ExceptionHandlingMiddleware> _logger = logger;
	private readonly IWebHostEnvironment _environment = environment;

	public async Task InvokeAsync(HttpContext context, IStringLocalizer localizer)
	{
		try
		{
			await _next(context);
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, "An unhandled exception occurred: {Message}", ex.Message);
			await HandleExceptionAsync(context, ex, localizer);
		}
	}

	private async Task HandleExceptionAsync(HttpContext context, Exception exception, IStringLocalizer localizer)
	{
		context.Response.ContentType = MediaTypeNames.Application.ProblemJson;

		var (statusCode, title, detail, errors) = exception switch
		{
			ValidationException validationEx => (
				(int)HttpStatusCode.BadRequest,
				localizer["Error.BadRequest"].Value,
				"One or more validation errors occurred.",
				(object)
					validationEx.Errors.GroupBy(e => e.PropertyName).ToDictionary(g => g.Key, g => g.Select(e => e.ErrorMessage).ToArray())
			),
			UnauthorizedAccessException => (
				(int)HttpStatusCode.Unauthorized,
				localizer["Error.Unauthorized"].Value,
				"You are not authorized to access this resource.",
				(object?)null
			),
			KeyNotFoundException => (
				(int)HttpStatusCode.NotFound,
				localizer["Error.NotFound"].Value,
				"The requested resource was not found.",
				(object?)null
			),
			ArgumentException argumentEx => ((int)HttpStatusCode.BadRequest, "Bad Request", argumentEx.Message, (object?)null),
			InvalidOperationException invalidOpEx => ((int)HttpStatusCode.BadRequest, "Bad Request", invalidOpEx.Message, (object?)null),
			_ => (
				(int)HttpStatusCode.InternalServerError,
				localizer["Error.InternalServerError"].Value,
				"An unexpected error occurred while processing your request.",
				(object?)null
			),
		};

		context.Response.StatusCode = statusCode;

		var problemDetails = new Dictionary<string, object>
		{
			["type"] = GetTypeUri(statusCode),
			["title"] = title,
			["status"] = statusCode,
			["detail"] = detail,
			["instance"] = context.Request.Path,
			["traceId"] = context.TraceIdentifier,
		};

		if (errors != null)
		{
			problemDetails["errors"] = errors;
		}

		if (_environment.IsDevelopment())
		{
			problemDetails["exception"] = exception.GetType().Name;
			problemDetails["stackTrace"] = exception.StackTrace ?? string.Empty;
		}

		var options = new JsonSerializerOptions
		{
			PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
			DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull,
		};

		await context.Response.WriteAsync(JsonSerializer.Serialize(problemDetails, options));
	}

	private static string GetTypeUri(int statusCode) =>
		statusCode switch
		{
			400 => "https://tools.ietf.org/html/rfc7231#section-6.5.1",
			401 => "https://tools.ietf.org/html/rfc7235#section-3.1",
			403 => "https://tools.ietf.org/html/rfc7231#section-6.5.3",
			404 => "https://tools.ietf.org/html/rfc7231#section-6.5.4",
			409 => "https://tools.ietf.org/html/rfc7231#section-6.5.8",
			500 => "https://tools.ietf.org/html/rfc7231#section-6.6.1",
			_ => "https://tools.ietf.org/html/rfc7231",
		};
}
