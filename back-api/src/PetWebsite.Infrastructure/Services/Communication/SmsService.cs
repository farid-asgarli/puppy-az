using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Constants;
using PetWebsite.Domain.Exceptions;
using PetWebsite.Infrastructure.Configuration;

namespace PetWebsite.Infrastructure.Services.Communication;

/// <summary>
/// Service for sending SMS messages via LSIM (Falkon.az) provider.
/// </summary>
public class SmsService(
	IOptions<SmsSettings> settings,
	IHttpClientFactory httpClientFactory,
	ILogger<SmsService> logger,
	IStringLocalizer localizer
) : ISmsService
{
	private readonly SmsSettings _settings = settings.Value;
	private readonly IHttpClientFactory _httpClientFactory = httpClientFactory;
	private readonly ILogger<SmsService> _logger = logger;
	private readonly IStringLocalizer _localizer = localizer;

	/// <inheritdoc/>
	public async Task SendSmsAsync(SendSmsOptions options, CancellationToken cancellationToken = default)
	{
		if (string.IsNullOrWhiteSpace(options.Body))
		{
			throw new SmsException(LocalizationKeys.Sms.InvalidBody, _localizer[LocalizationKeys.Sms.InvalidBody]);
		}

		if (string.IsNullOrWhiteSpace(options.Msisdn))
		{
			throw new SmsException(LocalizationKeys.Sms.InvalidMsisdn, _localizer[LocalizationKeys.Sms.InvalidMsisdn]);
		}

		try
		{
			// Generate password hash (MD5)
			var passwordHash = ComputeMd5Hash(_settings.Password);

			// Generate key hash: MD5(passwordHash + login + message + msisdn + sender)
			var keyInput = passwordHash + _settings.Login + options.Body + options.Msisdn + _settings.Sender;
			var keyHash = ComputeMd5Hash(keyInput);

			// URL encode message and sender
			var textEncoded = Uri.EscapeDataString(options.Body);
			var senderEncoded = Uri.EscapeDataString(_settings.Sender);

			// Build the request URL
			var url =
				$"{_settings.SendMessageUrl}login={_settings.Login}&msisdn={options.Msisdn}"
				+ $"&text={textEncoded}&sender={senderEncoded}&key={keyHash}";

			var httpClient = _httpClientFactory.CreateClient();
			var response = await httpClient.GetAsync(url, cancellationToken);

			if (!response.IsSuccessStatusCode)
			{
				_logger.LogError("Failed to send SMS to {Msisdn}. Status: {StatusCode}", options.Msisdn, response.StatusCode);
				throw new SmsException(LocalizationKeys.Sms.SendFailed, _localizer[LocalizationKeys.Sms.SendFailed, response.StatusCode]);
			}

			_logger.LogInformation("SMS sent successfully to {Msisdn}", options.Msisdn);
		}
		catch (HttpRequestException ex)
		{
			_logger.LogError(ex, "HTTP request failed while sending SMS to {Msisdn}", options.Msisdn);
			throw new SmsException(LocalizationKeys.Sms.NetworkError, _localizer[LocalizationKeys.Sms.NetworkError], ex);
		}
		catch (SmsException)
		{
			throw;
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, "Unexpected error while sending SMS to {Msisdn}", options.Msisdn);
			throw new SmsException(LocalizationKeys.Error.InternalServerError, _localizer[LocalizationKeys.Error.InternalServerError], ex);
		}
	}

	/// <inheritdoc/>
	public async Task<decimal> CheckSmsBalanceAsync(CancellationToken cancellationToken = default)
	{
		try
		{
			// Generate password hash (MD5)
			var passwordHash = ComputeMd5Hash(_settings.Password);

			// Generate key hash: MD5(passwordHash + login)
			var keyInput = passwordHash + _settings.Login;
			var keyHash = ComputeMd5Hash(keyInput);

			// Build the request URL
			var url = $"{_settings.CheckBalanceUrl}login={_settings.Login}&key={keyHash}";

			var httpClient = _httpClientFactory.CreateClient();
			var response = await httpClient.GetAsync(url, cancellationToken);

			if (!response.IsSuccessStatusCode)
			{
				_logger.LogError("Failed to check SMS balance. Status: {StatusCode}", response.StatusCode);
				throw new SmsException(
					LocalizationKeys.Sms.BalanceCheckFailed,
					_localizer[LocalizationKeys.Sms.BalanceCheckFailed, response.StatusCode]
				);
			}

			var content = await response.Content.ReadAsStringAsync(cancellationToken);
			var lsimResponse = JsonSerializer.Deserialize<LsimResponse>(
				content,
				new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
			);

			if (lsimResponse?.Data == null)
			{
				_logger.LogWarning("SMS balance check returned null or invalid response");
				throw new SmsException(LocalizationKeys.Sms.InvalidResponse, _localizer[LocalizationKeys.Sms.InvalidResponse]);
			}

			var balance = lsimResponse.Data.Obj;
			_logger.LogInformation("SMS balance checked successfully. Balance: {Balance}", balance);

			return balance;
		}
		catch (HttpRequestException ex)
		{
			_logger.LogError(ex, "HTTP request failed while checking SMS balance");
			throw new SmsException(LocalizationKeys.Sms.NetworkError, _localizer[LocalizationKeys.Sms.NetworkError], ex);
		}
		catch (JsonException ex)
		{
			_logger.LogError(ex, "Failed to parse SMS balance response");
			throw new SmsException(LocalizationKeys.Sms.InvalidResponse, _localizer[LocalizationKeys.Sms.InvalidResponse], ex);
		}
		catch (SmsException)
		{
			throw;
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, "Unexpected error while checking SMS balance");
			throw new SmsException(LocalizationKeys.Error.InternalServerError, _localizer[LocalizationKeys.Error.InternalServerError], ex);
		}
	}

	/// <summary>
	/// Computes MD5 hash of the input string.
	/// </summary>
	private static string ComputeMd5Hash(string input)
	{
		var inputBytes = Encoding.UTF8.GetBytes(input);
		var hashBytes = MD5.HashData(inputBytes);
		return Convert.ToHexString(hashBytes).ToLowerInvariant();
	}
}
