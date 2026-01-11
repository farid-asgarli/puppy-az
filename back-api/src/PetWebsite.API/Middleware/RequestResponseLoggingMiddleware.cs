using System.Diagnostics;
using System.Text;

namespace PetWebsite.API.Middleware;

public class RequestResponseLoggingMiddleware(RequestDelegate next, ILogger<RequestResponseLoggingMiddleware> logger)
{
	private const int MaxBodyLogLength = 1024; // Limit body logging to 4KB to avoid huge logs

	public async Task InvokeAsync(HttpContext context)
	{
		var stopwatch = Stopwatch.StartNew();
		var requestId = Guid.NewGuid().ToString("N")[..8];

		// Log request
		await LogRequestAsync(context, requestId);

		// Capture original response body stream
		var originalBodyStream = context.Response.Body;

		try
		{
			using var responseBody = new MemoryStream();
			context.Response.Body = responseBody;

			// Call the next middleware in the pipeline
			await next(context);

			stopwatch.Stop();

			// Log response
			await LogResponseAsync(context, responseBody, requestId, stopwatch.ElapsedMilliseconds);

			// Copy response body back to the original stream
			await responseBody.CopyToAsync(originalBodyStream);
		}
		finally
		{
			context.Response.Body = originalBodyStream;
		}
	}

	private async Task LogRequestAsync(HttpContext context, string requestId)
	{
		var request = context.Request;

		// Enable request body buffering to allow multiple reads
		request.EnableBuffering();

		var requestBody = await ReadRequestBodyAsync(request);

		var logMessage = new StringBuilder();
		logMessage.AppendLine($"[{requestId}] HTTP Request Information:");
		logMessage.AppendLine($"Method: {request.Method}");
		logMessage.AppendLine($"Path: {request.Path}{request.QueryString}");
		logMessage.AppendLine($"Host: {request.Host}");
		logMessage.AppendLine($"Content-Type: {request.ContentType ?? "N/A"}");
		logMessage.AppendLine($"Content-Length: {request.ContentLength?.ToString() ?? "N/A"}");

		if (!string.IsNullOrEmpty(requestBody))
		{
			logMessage.AppendLine($"Body: {requestBody}");
		}

		logger.LogInformation(logMessage.ToString());

		// Reset the request body stream position for the next middleware
		request.Body.Position = 0;
	}

	private async Task LogResponseAsync(HttpContext context, MemoryStream responseBody, string requestId, long elapsedMs)
	{
		var response = context.Response;

		responseBody.Seek(0, SeekOrigin.Begin);
		var responseBodyText = await ReadResponseBodyAsync(responseBody, response.ContentType);

		var logMessage = new StringBuilder();
		logMessage.AppendLine($"[{requestId}] HTTP Response Information:");
		logMessage.AppendLine($"Status Code: {response.StatusCode}");
		logMessage.AppendLine($"Content-Type: {response.ContentType ?? "N/A"}");
		logMessage.AppendLine($"Content-Length: {responseBody.Length}");
		logMessage.AppendLine($"Elapsed Time: {elapsedMs}ms");

		if (!string.IsNullOrEmpty(responseBodyText))
		{
			logMessage.AppendLine($"Body: {responseBodyText}");
		}

		// Use different log levels based on status code
		if (response.StatusCode >= 500)
		{
			logger.LogError(logMessage.ToString());
		}
		else if (response.StatusCode >= 400)
		{
			logger.LogWarning(logMessage.ToString());
		}
		else
		{
			logger.LogInformation(logMessage.ToString());
		}

		responseBody.Seek(0, SeekOrigin.Begin);
	}

	private static async Task<string> ReadRequestBodyAsync(HttpRequest request)
	{
		if (request.ContentLength == null || request.ContentLength == 0)
		{
			return string.Empty;
		}

		// Check if content type is loggable (skip binary content)
		var contentType = request.ContentType?.ToLower() ?? "";
		if (
			contentType.Contains("image/")
			|| contentType.Contains("video/")
			|| contentType.Contains("audio/")
			|| contentType.Contains("application/octet-stream")
		)
		{
			return $"[Binary content: {contentType}]";
		}

		try
		{
			using var reader = new StreamReader(
				request.Body,
				encoding: Encoding.UTF8,
				detectEncodingFromByteOrderMarks: false,
				bufferSize: 1024,
				leaveOpen: true
			);

			var body = await reader.ReadToEndAsync();

			// Truncate if too long
			return body.Length > MaxBodyLogLength ? body[..MaxBodyLogLength] + $"... (truncated, total: {body.Length} chars)" : body;
		}
		catch (Exception ex)
		{
			return $"[Error reading body: {ex.Message}]";
		}
	}

	private static async Task<string> ReadResponseBodyAsync(MemoryStream responseBody, string? contentType)
	{
		if (responseBody.Length == 0)
		{
			return string.Empty;
		}

		// Check if content type is loggable (skip binary content)
		var contentTypeLower = contentType?.ToLower() ?? "";
		if (
			contentTypeLower.Contains("image/")
			|| contentTypeLower.Contains("video/")
			|| contentTypeLower.Contains("audio/")
			|| contentTypeLower.Contains("application/octet-stream")
		)
		{
			return $"[Binary content: {contentType}, size: {responseBody.Length} bytes]";
		}

		try
		{
			using var reader = new StreamReader(
				responseBody,
				encoding: Encoding.UTF8,
				detectEncodingFromByteOrderMarks: false,
				leaveOpen: true
			);
			var body = await reader.ReadToEndAsync();

			// Truncate if too long
			return body.Length > MaxBodyLogLength ? body[..MaxBodyLogLength] + $"... (truncated, total: {body.Length} chars)" : body;
		}
		catch (Exception ex)
		{
			return $"[Error reading response body: {ex.Message}]";
		}
	}
}
