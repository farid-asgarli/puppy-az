using System.Text;
using System.Text.Encodings.Web;
using System.Text.Json;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Infrastructure.Settings;

namespace PetWebsite.Infrastructure.Services;

public class TelegramService : ITelegramService
{
    private readonly HttpClient _httpClient;
    private readonly TelegramSettings _settings;
    private readonly ILogger<TelegramService> _logger;
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
        PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower
    };

    public TelegramService(HttpClient httpClient, IOptions<TelegramSettings> settings, ILogger<TelegramService> logger)
    {
        _httpClient = httpClient;
        _settings = settings.Value;
        _logger = logger;
    }

    public async Task SendNewAdNotificationAsync(
        int adId, 
        string title, 
        string? category, 
        string? breed, 
        decimal? price, 
        string city, 
        string? phoneNumber,
        CancellationToken ct = default)
    {
        if (!_settings.IsEnabled)
        {
            _logger.LogDebug("Telegram notifications are disabled");
            return;
        }

        if (string.IsNullOrEmpty(_settings.BotToken) || string.IsNullOrEmpty(_settings.ChatId))
        {
            _logger.LogWarning("Telegram settings are not configured properly");
            return;
        }

        try
        {
            var message = BuildNotificationMessage(title, category, breed, price, city, phoneNumber);
            var adminUrl = $"{_settings.AdminPanelUrl.TrimEnd('/')}/listings/{adId}";
            await SendMessageWithButtonAsync(message, adminUrl, adId, ct);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send Telegram notification for ad {AdId}", adId);
        }
    }

    private static string BuildNotificationMessage(string title, string? category, string? breed, decimal? price, string city, string? phoneNumber)
    {
        var sb = new StringBuilder();
        
        sb.AppendLine("🐾 Yeni Elan Gözləyir!");
        sb.AppendLine();
        sb.AppendLine($"📋 Başlıq: {title}");
        
        if (!string.IsNullOrEmpty(category))
            sb.AppendLine($"🏷️ Kateqoriya: {category}");
        
        if (!string.IsNullOrEmpty(breed))
            sb.AppendLine($"🐕 Cins: {breed}");
        
        if (price.HasValue)
            sb.AppendLine($"💰 Qiymət: {price:N0} AZN");
        
        sb.AppendLine($"📍 Şəhər: {city}");
        
        if (!string.IsNullOrEmpty(phoneNumber))
            sb.AppendLine($"📞 Telefon: {phoneNumber}");

        return sb.ToString();
    }

    private async Task SendMessageWithButtonAsync(string message, string url, int adId, CancellationToken ct)
    {
        var apiUrl = $"https://api.telegram.org/bot{_settings.BotToken}/sendMessage";
        
        // Telegram rejects localhost URLs in inline keyboard buttons
        // If URL is localhost, include it as text instead
        var isLocalUrl = url.Contains("localhost", StringComparison.OrdinalIgnoreCase) 
                      || url.Contains("127.0.0.1");
        
        object payload;
        if (isLocalUrl)
        {
            // Telegram blocks localhost URLs in both inline buttons and HTML <a> tags.
            // Show URL as plain text so admin can copy-paste it.
            // In production with a real domain, the clickable inline button will be used.
            payload = new
            {
                chat_id = _settings.ChatId,
                text = message + $"\n🔗 Link: {url}"
            };
        }
        else
        {
            // Production: send with clickable inline button
            payload = new
            {
                chat_id = _settings.ChatId,
                text = message,
                reply_markup = new
                {
                    inline_keyboard = new[]
                    {
                        new[]
                        {
                            new { text = "🔗 Elanı yoxla", url }
                        }
                    }
                }
            };
        }

        var json = JsonSerializer.Serialize(payload, JsonOptions);
        var content = new StringContent(json, Encoding.UTF8, "application/json");
        
        var response = await _httpClient.PostAsync(apiUrl, content, ct);
        
        if (response.IsSuccessStatusCode)
        {
            _logger.LogInformation("Telegram notification sent successfully for ad {AdId}", adId);
        }
        else
        {
            var errorContent = await response.Content.ReadAsStringAsync(ct);
            _logger.LogWarning("Failed to send Telegram notification for ad {AdId}. Status: {StatusCode}, Response: {Response}", 
                adId, response.StatusCode, errorContent);
        }
    }
}
