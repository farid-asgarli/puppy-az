using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Xml.Linq;
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
/// Service for sending SMS messages via ATL InfoTech (atlsms.az) provider.
/// Uses the JSON API for sending and the XML Bulk API for balance checks.
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
			var key = ComputeMd5Hash(_settings.Password);

			var payload = new
			{
				login = _settings.Login,
				key,
				sender = _settings.Sender,
				scheduled = "NOW",
				text = options.Body,
				msisdn = options.Msisdn,
				unicode = false,
			};

			var httpClient = _httpClientFactory.CreateClient();
			var jsonContent = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");

			var response = await httpClient.PostAsync(_settings.SendMessageUrl, jsonContent, cancellationToken);

			if (!response.IsSuccessStatusCode)
			{
				_logger.LogError("Failed to send SMS to {Msisdn}. Status: {StatusCode}", options.Msisdn, response.StatusCode);
				throw new SmsException(LocalizationKeys.Sms.SendFailed, _localizer[LocalizationKeys.Sms.SendFailed, response.StatusCode]);
			}

			var content = await response.Content.ReadAsStringAsync(cancellationToken);
			var atlResponse = JsonSerializer.Deserialize<AtlSmsResponse>(
				content,
				new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
			);

			if (atlResponse?.ErrorCode != null)
			{
				_logger.LogError(
					"ATL SMS error for {Msisdn}. Code: {ErrorCode}, Message: {Message}",
					options.Msisdn,
					atlResponse.ErrorCode,
					atlResponse.Message
				);
				throw new SmsException(LocalizationKeys.Sms.SendFailed, _localizer[LocalizationKeys.Sms.SendFailed, atlResponse.ErrorCode]);
			}

			_logger.LogInformation("SMS sent successfully to {Msisdn}. TransId: {TransId}", options.Msisdn, atlResponse?.TransId);
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
			// ATL balance check uses the XML Bulk API
			var xmlRequest = new XDocument(
				new XElement(
					"request",
					new XElement(
						"head",
						new XElement("operation", "units"),
						new XElement("login", _settings.Login),
						new XElement("password", _settings.Password)
					)
				)
			);

			var httpClient = _httpClientFactory.CreateClient();
			var xmlContent = new StringContent(xmlRequest.ToString(), Encoding.UTF8, "application/xml");
			var response = await httpClient.PostAsync(_settings.BulkApiUrl, xmlContent, cancellationToken);

			if (!response.IsSuccessStatusCode)
			{
				_logger.LogError("Failed to check SMS balance. Status: {StatusCode}", response.StatusCode);
				throw new SmsException(
					LocalizationKeys.Sms.BalanceCheckFailed,
					_localizer[LocalizationKeys.Sms.BalanceCheckFailed, response.StatusCode]
				);
			}

			var content = await response.Content.ReadAsStringAsync(cancellationToken);
			var xmlResponse = XDocument.Parse(content);

			var responseCode = xmlResponse.Root?.Element("head")?.Element("responsecode")?.Value;
			if (responseCode != "000")
			{
				_logger.LogWarning("SMS balance check failed with response code: {ResponseCode}", responseCode);
				throw new SmsException(
					LocalizationKeys.Sms.BalanceCheckFailed,
					_localizer[LocalizationKeys.Sms.BalanceCheckFailed, responseCode ?? "unknown"]
				);
			}

			var unitsStr = xmlResponse.Root?.Element("body")?.Element("units")?.Value;
			if (!decimal.TryParse(unitsStr, out var balance))
			{
				_logger.LogWarning("SMS balance check returned invalid units value: {Units}", unitsStr);
				throw new SmsException(LocalizationKeys.Sms.InvalidResponse, _localizer[LocalizationKeys.Sms.InvalidResponse]);
			}

			_logger.LogInformation("SMS balance checked successfully. Balance: {Balance}", balance);
			return balance;
		}
		catch (HttpRequestException ex)
		{
			_logger.LogError(ex, "HTTP request failed while checking SMS balance");
			throw new SmsException(LocalizationKeys.Sms.NetworkError, _localizer[LocalizationKeys.Sms.NetworkError], ex);
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
