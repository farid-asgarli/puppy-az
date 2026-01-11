using System.Diagnostics;
using MediatR;
using Microsoft.Extensions.Logging;

namespace PetWebsite.Application.Common.Behaviors;

/// <summary>
/// MediatR pipeline behavior for logging request execution time and exceptions.
/// </summary>
/// <typeparam name="TRequest">The request type</typeparam>
/// <typeparam name="TResponse">The response type</typeparam>
public class LoggingBehavior<TRequest, TResponse>(ILogger<LoggingBehavior<TRequest, TResponse>> logger)
	: IPipelineBehavior<TRequest, TResponse>
	where TRequest : notnull
{
	private readonly ILogger<LoggingBehavior<TRequest, TResponse>> _logger = logger;

	public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
	{
		var requestName = typeof(TRequest).Name;
		var stopwatch = Stopwatch.StartNew();

		_logger.LogInformation("Handling {RequestName}", requestName);

		try
		{
			var response = await next();

			stopwatch.Stop();

			if (stopwatch.ElapsedMilliseconds > 500)
			{
				_logger.LogWarning("{RequestName} completed in {ElapsedMilliseconds}ms (slow)", requestName, stopwatch.ElapsedMilliseconds);
			}
			else
			{
				_logger.LogInformation("{RequestName} completed in {ElapsedMilliseconds}ms", requestName, stopwatch.ElapsedMilliseconds);
			}

			return response;
		}
		catch (Exception ex)
		{
			stopwatch.Stop();

			_logger.LogError(
				ex,
				"{RequestName} failed after {ElapsedMilliseconds}ms: {ErrorMessage}",
				requestName,
				stopwatch.ElapsedMilliseconds,
				ex.Message
			);

			throw;
		}
	}
}
