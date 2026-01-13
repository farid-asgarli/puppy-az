using System.Security.Cryptography;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Domain.Constants;
using PetWebsite.Domain.Exceptions;

namespace PetWebsite.Infrastructure.Services.Files;

/// <summary>
/// Implementation of checksum calculation service.
/// </summary>
public class ChecksumService(ILogger<ChecksumService> logger, IStringLocalizer localizer) : IChecksumService
{
	private readonly ILogger<ChecksumService> _logger = logger;
	private readonly IStringLocalizer _localizer = localizer;

	public async Task<string> CalculateChecksumAsync(
		Stream stream,
		string algorithm = "SHA256",
		CancellationToken cancellationToken = default
	)
	{
		ArgumentNullException.ThrowIfNull(stream);

		if (!stream.CanRead)
		{
			throw new ArgumentException("Stream must be readable.", nameof(stream));
		}

		try
		{
			using HashAlgorithm hashAlgorithm = algorithm.ToUpperInvariant() switch
			{
				"MD5" => MD5.Create(),
				"SHA256" => SHA256.Create(),
				"SHA512" => SHA512.Create(),
				_ => SHA256.Create(),
			};

			var originalPosition = stream.CanSeek ? stream.Position : 0;

			if (stream.CanSeek)
			{
				stream.Position = 0;
			}

			var hashBytes = await hashAlgorithm.ComputeHashAsync(stream, cancellationToken);

			if (stream.CanSeek)
			{
				stream.Position = originalPosition;
			}

			return BitConverter.ToString(hashBytes).Replace("-", "").ToLowerInvariant();
		}
		catch (Exception ex) when (ex is not OperationCanceledException)
		{
			_logger.LogError(ex, "Error calculating checksum with algorithm: {Algorithm}", algorithm);
			var message = _localizer[LocalizationKeys.File.FailedToCalculateChecksum, algorithm];
			throw new FileException(LocalizationKeys.File.FailedToCalculateChecksum, message, ex);
		}
	}

	public bool VerifyChecksum(string actualChecksum, string expectedChecksum)
	{
		if (string.IsNullOrWhiteSpace(actualChecksum) || string.IsNullOrWhiteSpace(expectedChecksum))
		{
			return false;
		}

		return string.Equals(actualChecksum, expectedChecksum, StringComparison.OrdinalIgnoreCase);
	}
}
